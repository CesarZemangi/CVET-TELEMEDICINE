import { Case, Vet } from "../models/associations.js";
import AiPredictionLog from "../models/aiPredictionLog.model.js";
import { logAction } from "../utils/dbLogger.js";

const MEDICATION_GUIDANCE = {
  mastitis: "Intramammary antibiotics (culture-guided), anti-inflammatory support",
  anthrax: "Immediate isolation and protocol-based antibiotic treatment per regulations",
  theileriosis: "Antiprotozoal treatment and tick control support",
  brucellosis: "Confirmatory testing and herd-control protocol; avoid empirical treatment",
  default: "Supportive care and treatment after confirmatory veterinary assessment"
};

const FALLBACK_RULES = [
  { pattern: /(udder|mastitis|milk clots|teat|swollen udder)/i, disease: "Mastitis", tests: ["Milk CMT", "Milk culture"] },
  { pattern: /(tick|lymph node|anemia|theileriosis|piroplasmosis)/i, disease: "Theileriosis", tests: ["Blood smear", "PCR panel"] },
  { pattern: /(bloody discharge|abortion|brucellosis|retained placenta)/i, disease: "Brucellosis", tests: ["Rose Bengal test", "ELISA"] },
  { pattern: /(sudden death|anthrax|bloody stool|no rigor)/i, disease: "Anthrax", tests: ["Peripheral blood smear", "Regulatory confirmatory test"] }
];

const getMedicationSuggestion = (disease) => {
  const normalized = String(disease || "").trim().toLowerCase();
  return MEDICATION_GUIDANCE[normalized] || MEDICATION_GUIDANCE.default;
};

const normalizePrediction = (prediction) => {
  const predictedDisease = prediction?.predicted_disease || prediction?.disease || "Unknown";
  const confidence = Number(prediction?.confidence);
  const suggestedTests = Array.isArray(prediction?.recommended_tests)
    ? prediction.recommended_tests
    : Array.isArray(prediction?.suggested_tests)
      ? prediction.suggested_tests
      : [];

  return {
    predicted_disease: predictedDisease,
    confidence: Number.isFinite(confidence) ? confidence : null,
    suggested_tests: suggestedTests,
    suggested_medication: prediction?.suggested_medication || getMedicationSuggestion(predictedDisease)
  };
};

const buildFallbackPrediction = (symptomsText) => {
  const matched = FALLBACK_RULES.find((rule) => rule.pattern.test(symptomsText));
  const predictedDisease = matched?.disease || "General Infection/Inflammation";
  const suggestedTests = matched?.tests || ["CBC", "Temperature check", "Physical examination"];
  return {
    predicted_disease: predictedDisease,
    confidence: 0.35,
    suggested_tests: suggestedTests,
    suggested_medication: getMedicationSuggestion(predictedDisease)
  };
};

export const predictDisease = async (req, res) => {
  const startedAt = Date.now();
  try {
    const symptoms = req.body?.symptoms;
    const caseId = req.body?.case_id ? Number(req.body.case_id) : null;
    if (!String(symptoms || "").trim()) {
      return res.status(400).json({ error: "symptoms is required" });
    }

    let vetRecord = null;
    let vetId = null;
    if (req.user?.role === "vet") {
      vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
      vetId = vetRecord?.id || Number(req.user.id);
    }

    let linkedCase = null;
    if (Number.isFinite(caseId)) {
      linkedCase = await Case.findByPk(caseId, { attributes: ["id", "farmer_id", "vet_id"] });
      if (!linkedCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      if (req.user?.role === "vet") {
        const allowedVetIds = new Set([Number(vetId), Number(req.user.id)].filter(Number.isFinite));
        if (!allowedVetIds.has(Number(linkedCase.vet_id))) {
          return res.status(403).json({ error: "Forbidden: case is not assigned to this vet" });
        }
      }

      if (req.user?.role === "farmer" && Number(linkedCase.farmer_id) !== Number(req.user.id)) {
        return res.status(403).json({ error: "Forbidden: case is not owned by this farmer" });
      }
    }

    let normalizedPrediction = null;
    let source = "ml_api";

    try {
      const mlApiBase = process.env.ML_API_URL || "http://127.0.0.1:8001";
      const response = await fetch(`${mlApiBase}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
      });

      if (!response.ok) {
        throw new Error(`ML API error (${response.status})`);
      }

      const prediction = await response.json();
      normalizedPrediction = normalizePrediction(prediction);
    } catch (mlErr) {
      source = "rule_fallback";
      normalizedPrediction = buildFallbackPrediction(String(symptoms || ""));
      console.warn("ML API unavailable, using fallback prediction:", mlErr.message);
    }

    if (req.user?.role === "vet" && Number.isFinite(caseId)) {
      try {
        await AiPredictionLog.create({
          case_id: caseId,
          vet_id: vetId,
          farmer_id: linkedCase?.farmer_id || null,
          predicted_disease: normalizedPrediction.predicted_disease || "Unknown",
          confidence: Number.isFinite(Number(normalizedPrediction.confidence))
            ? Number(normalizedPrediction.confidence)
            : 0
        });
      } catch (logErr) {
        console.warn("AI prediction log write failed:", logErr.message);
      }
    }

    await logAction(
      req.user.id,
      `AI prediction success in ${Date.now() - startedAt}ms`,
      { actionType: "read", module: "ai", entityId: Number.isFinite(caseId) ? caseId : null, ipAddress: req.ip }
    );

    return res.json({
      data: normalizedPrediction,
      source,
      disclaimer: "Advisory only. Final diagnosis must be confirmed by a veterinarian."
    });
  } catch (err) {
    await logAction(req.user?.id || null, `AI prediction failed in ${Date.now() - startedAt}ms: ${err.message}`, {
      actionType: "error",
      module: "ai",
      ipAddress: req.ip
    });
    return res.status(500).json({ error: err.message });
  }
};

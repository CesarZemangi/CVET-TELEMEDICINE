import { Vet } from "../models/associations.js";
import AiPredictionLog from "../models/aiPredictionLog.model.js";
import { logAction } from "../utils/dbLogger.js";

const MEDICATION_GUIDANCE = {
  mastitis: "Intramammary antibiotics (culture-guided), anti-inflammatory support",
  anthrax: "Immediate isolation and protocol-based antibiotic treatment per regulations",
  theileriosis: "Antiprotozoal treatment and tick control support",
  brucellosis: "Confirmatory testing and herd-control protocol; avoid empirical treatment",
  default: "Supportive care and treatment after confirmatory veterinary assessment"
};

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

export const predictDisease = async (req, res) => {
  const startedAt = Date.now();
  try {
    const symptoms = req.body?.symptoms;
    const caseId = req.body?.case_id ? Number(req.body.case_id) : null;
    if (!String(symptoms || "").trim()) {
      return res.status(400).json({ error: "symptoms is required" });
    }

    const mlApiBase = process.env.ML_API_URL || "http://127.0.0.1:8001";
    const response = await fetch(`${mlApiBase}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: `ML API error: ${text}` });
    }

    const prediction = await response.json();
    const normalizedPrediction = normalizePrediction(prediction);

    try {
      const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
      const vetId = vetRecord?.id || Number(req.user.id);
      await AiPredictionLog.create({
        case_id: Number.isFinite(caseId) ? caseId : null,
        vet_id: vetId,
        predicted_disease: normalizedPrediction.predicted_disease || "Unknown",
        confidence: normalizedPrediction.confidence
      });
    } catch (logErr) {
      console.warn("AI prediction log write failed:", logErr.message);
    }

    await logAction(
      req.user.id,
      `AI prediction success in ${Date.now() - startedAt}ms`,
      { actionType: "read", module: "ai", entityId: Number.isFinite(caseId) ? caseId : null, ipAddress: req.ip }
    );

    return res.json({
      data: normalizedPrediction,
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

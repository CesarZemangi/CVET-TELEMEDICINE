import { Case, Vet, Payment, Appointment, User } from "../models/associations.js";
import AiPredictionLog from "../models/aiPredictionLog.model.js";
import { logAction } from "../utils/dbLogger.js";
import { getVetRatingsSummaryByVetIds } from "../services/vetRating.service.js";
import { getPaymentAttributes } from "../utils/paymentSchema.js";

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
  { pattern: /(sudden death|anthrax|bloody stool|no rigor)/i, disease: "Anthrax", tests: ["Peripheral blood smear", "Regulatory confirmatory test"] },
  { pattern: /(cough|nasal discharge|respiratory|labored breathing|dyspnea)/i, disease: "Respiratory Infection", tests: ["Auscultation", "Thoracic ultrasound", "CBC"] },
  { pattern: /(diarrhea|loose stool|scours|colic|rumen|bloat)/i, disease: "Enteritis/Scours", tests: ["Fecal exam", "Electrolytes", "Rumen fluid analysis"] },
  { pattern: /(lameness|limp|hoof|joint swelling|founder)/i, disease: "Lameness/Hoof Disorder", tests: ["Hoof exam", "Lameness scoring", "Joint tap if swollen"] },
  { pattern: /(eye discharge|pinkeye|cornea|ocular|conjunctivitis)/i, disease: "Ocular Infection (Pinkeye)", tests: ["Ophthalmic exam", "Fluorescein stain"] },
  { pattern: /(skin|lesion|rash|mange|hair loss|alopecia)/i, disease: "Dermatitis/Mange", tests: ["Skin scraping", "Cytology"] },
  { pattern: /(fever|pyrexia|hot|temperature)/i, disease: "Febrile Illness", tests: ["CBC", "Blood smear", "Urinalysis"] }
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
    confidence: matched ? 0.55 : 0.35,
    suggested_tests: suggestedTests,
    suggested_medication: getMedicationSuggestion(predictedDisease)
  };
};

const buildPaymentInsightRecords = (payments = []) =>
  payments.map((payment) => ({
    farmer_id: payment.farmer_id,
    vet_id: payment.vet_id,
    amount: Number(payment.amount) || 0,
    payment_method: payment.payment_method || "unknown",
    payment_provider: payment.payment_provider || "unknown",
    payment_status: payment.payment_status || "unknown",
    appointment_status: payment.appointment?.status || "unknown",
    created_at: payment.created_at,
    appointment_date: payment.appointment?.appointment_date || null
  }));

const buildFallbackPaymentInsights = (records = [], vetId = null) => {
  const scoped = Number.isFinite(Number(vetId))
    ? records.filter((record) => Number(record.vet_id) === Number(vetId))
    : records;

  const countBy = (items, key) => {
    const counts = new Map();
    items.forEach((item) => {
      const value = item[key];
      if (!value) return;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  };

  const successful = records.filter((record) => String(record.payment_status).toLowerCase() === "paid");
  const methodCounts = countBy(records, "payment_method");
  const providerCounts = countBy(records, "payment_provider");
  const dayCounts = countBy(
    scoped.map((record) => ({
      ...record,
      day_of_week: record.created_at ? new Date(record.created_at).toLocaleDateString("en-US", { weekday: "long" }) : null
    })),
    "day_of_week"
  );
  const monthCounts = countBy(
    scoped.map((record) => ({
      ...record,
      month_name: record.created_at ? new Date(record.created_at).toLocaleDateString("en-US", { month: "long" }) : null
    })),
    "month_name"
  );

  const monthlyPaidTotals = new Map();
  successful
    .filter((record) => !Number.isFinite(Number(vetId)) || Number(record.vet_id) === Number(vetId))
    .forEach((record) => {
      if (!record.created_at) return;
      const date = new Date(record.created_at);
      const bucket = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyPaidTotals.set(bucket, (monthlyPaidTotals.get(bucket) || 0) + (Number(record.amount) || 0));
    });

  const monthlySeries = [...monthlyPaidTotals.values()];
  const predictedNextPeriodEarnings = monthlySeries.length
    ? monthlySeries.slice(-3).reduce((sum, value) => sum + value, 0) / Math.min(3, monthlySeries.length)
    : 0;

  const averageSuccessRate = records.length ? successful.length / records.length : null;

  return {
    demand_forecast: {
      busiest_day: dayCounts[0]?.[0] || null,
      busiest_month: monthCounts[0]?.[0] || null,
      top_vets: countBy(records, "vet_id").slice(0, 5).map(([id, consultation_count]) => ({ vet_id: Number(id), consultation_count })),
      frequent_farmers: countBy(records, "farmer_id").slice(0, 5).map(([id, payment_count]) => ({ farmer_id: Number(id), payment_count })),
      expected_next_period_consultations: scoped.length ? Math.max(1, Math.round(scoped.length / Math.max(1, new Set(scoped.map((record) => String(record.created_at || "").slice(0, 7))).size))) : 0
    },
    payment_success: {
      average_probability: averageSuccessRate,
      recommended_method: methodCounts[0]?.[0] || null,
      recommended_provider: providerCounts[0]?.[0] || null,
      by_method: methodCounts.slice(0, 5).map(([payment_method, total]) => ({
        payment_method,
        success_probability: averageSuccessRate,
        sample_size: total
      })),
      by_provider: providerCounts.slice(0, 5).map(([payment_provider, total]) => ({
        payment_provider,
        success_probability: averageSuccessRate,
        sample_size: total
      }))
    },
    earnings_prediction: {
      vet_id: Number.isFinite(Number(vetId)) ? Number(vetId) : null,
      predicted_next_period_earnings: Number(predictedNextPeriodEarnings.toFixed(2)),
      recent_paid_total: Number(successful.reduce((sum, record) => sum + (Number(record.amount) || 0), 0).toFixed(2))
    },
    farmer_segments: countBy(records, "farmer_id").slice(0, 10).map(([farmerId, total]) => ({
      farmer_id: Number(farmerId),
      segment: total >= 5 ? "frequent" : total >= 2 ? "occasional" : "inactive",
      total_payments: total,
      paid_payments: records.filter((record) => Number(record.farmer_id) === Number(farmerId) && String(record.payment_status).toLowerCase() === "paid").length
    }))
  };
};

const buildFallbackVetRecommendations = ({ farmerId, payments = [], vets = [], ratingsByVetId = new Map() }) => {
  const farmerPayments = payments.filter((payment) => Number(payment.farmer_id) === Number(farmerId));
  const farmerPaidPayments = farmerPayments.filter((payment) => String(payment.payment_status).toLowerCase() === "paid");
  const paymentsByVetId = new Map();
  const preferredMethods = new Map();
  const preferredProviders = new Map();

  farmerPaidPayments.forEach((payment) => {
    const vetId = Number(payment.vet_id);
    paymentsByVetId.set(vetId, (paymentsByVetId.get(vetId) || 0) + 1);
    if (payment.payment_method) {
      preferredMethods.set(payment.payment_method, (preferredMethods.get(payment.payment_method) || 0) + 1);
    }
    if (payment.payment_provider) {
      preferredProviders.set(payment.payment_provider, (preferredProviders.get(payment.payment_provider) || 0) + 1);
    }
  });

  const favoriteMethod = [...preferredMethods.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const favoriteProvider = [...preferredProviders.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return vets
    .map((vet) => {
      const ratingSummary = ratingsByVetId.get(vet.id) || {};
      const priorPaidCount = paymentsByVetId.get(Number(vet.id)) || 0;
      const averageRating = Number(ratingSummary.average_rating) || 0;
      const reviewCount = Number(ratingSummary.review_count) || 0;
      const score = priorPaidCount * 4 + averageRating * 2 + Math.min(reviewCount, 5) * 0.25;

      const reasons = [];
      if (priorPaidCount > 0) {
        reasons.push(`You completed ${priorPaidCount} paid consultation${priorPaidCount === 1 ? "" : "s"} with this vet before.`);
      }
      if (averageRating > 0) {
        reasons.push(`Average farmer rating is ${averageRating.toFixed(1)}/5.`);
      }
      if (vet.specialization) {
        reasons.push(`Specialization: ${vet.specialization}.`);
      }
      if (favoriteProvider) {
        reasons.push(`Matches your common payment preference: ${favoriteProvider}${favoriteMethod ? ` via ${favoriteMethod}` : ""}.`);
      }

      return {
        vet_id: vet.id,
        user_id: vet.user_id,
        vet_name: vet.User?.name || "Unknown Vet",
        specialization: vet.specialization || null,
        average_rating: averageRating || null,
        review_count: reviewCount,
        prior_paid_consultations: priorPaidCount,
        score: Number(score.toFixed(2)),
        reasons: reasons.slice(0, 3)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
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

export const getPaymentInsights = async (req, res) => {
  const startedAt = Date.now();
  try {
    let vetId = null;
    if (req.user?.role === "vet") {
      const vetRecord = await Vet.findOne({ where: { user_id: req.user.id } });
      if (!vetRecord) {
        return res.status(404).json({ error: "Vet record not found" });
      }
      vetId = vetRecord.id;
    } else if (req.user?.role === "admin" && req.query.vet_id) {
      vetId = Number(req.query.vet_id);
    }

    const paymentWhere = {};
    if (Number.isFinite(vetId)) {
      paymentWhere.vet_id = vetId;
    }

    const payments = await Payment.findAll({
      attributes: await getPaymentAttributes([
        "id",
        "farmer_id",
        "vet_id",
        "appointment_id",
        "amount",
        "payment_method",
        "payment_provider",
        "payment_status",
        "created_at"
      ]),
      where: paymentWhere,
      include: [
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "status", "appointment_date", "appointment_time"]
        },
        {
          model: Vet,
          as: "vet",
          attributes: ["id", "user_id"],
          include: [{ model: User, attributes: ["id", "name"], required: false }]
        },
        {
          model: User,
          as: "farmer",
          attributes: ["id", "name"],
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const records = buildPaymentInsightRecords(payments);
    let data = null;
    let source = "ml_api";

    try {
      const mlApiBase = process.env.ML_API_URL || "http://127.0.0.1:8001";
      const response = await fetch(`${mlApiBase}/payments/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records, vet_id: Number.isFinite(vetId) ? vetId : null })
      });

      if (!response.ok) {
        throw new Error(`ML API error (${response.status})`);
      }

      data = await response.json();
    } catch (err) {
      source = "rule_fallback";
      data = buildFallbackPaymentInsights(records, vetId);
      console.warn("Payment ML API unavailable, using fallback insights:", err.message);
    }

    const vetNameById = new Map(
      payments
        .map((payment) => [Number(payment.vet_id), payment.vet?.User?.name || `Vet #${payment.vet_id}`])
        .filter(([id]) => Number.isFinite(id))
    );
    const farmerNameById = new Map(
      payments
        .map((payment) => [Number(payment.farmer_id), payment.farmer?.name || `Farmer #${payment.farmer_id}`])
        .filter(([id]) => Number.isFinite(id))
    );

    if (Array.isArray(data?.demand_forecast?.top_vets)) {
      data.demand_forecast.top_vets = data.demand_forecast.top_vets.map((item) => ({
        ...item,
        vet_name: vetNameById.get(Number(item.vet_id)) || `Vet #${item.vet_id}`
      }));
    }

    if (Array.isArray(data?.demand_forecast?.frequent_farmers)) {
      data.demand_forecast.frequent_farmers = data.demand_forecast.frequent_farmers.map((item) => ({
        ...item,
        farmer_name: farmerNameById.get(Number(item.farmer_id)) || `Farmer #${item.farmer_id}`
      }));
    }

    await logAction(
      req.user.id,
      `Payment AI insight success in ${Date.now() - startedAt}ms`,
      { actionType: "read", module: "ai", ipAddress: req.ip }
    );

    return res.json({
      data,
      source,
      disclaimer: "Forecasts are advisory and based on historical payment and consultation behavior."
    });
  } catch (err) {
    await logAction(req.user?.id || null, `Payment AI insight failed in ${Date.now() - startedAt}ms: ${err.message}`, {
      actionType: "error",
      module: "ai",
      ipAddress: req.ip
    });
    return res.status(500).json({ error: err.message });
  }
};

export const getFarmerVetRecommendations = async (req, res) => {
  const startedAt = Date.now();
  try {
    if (req.user?.role !== "farmer") {
      return res.status(403).json({ error: "Only farmers can request vet recommendations" });
    }

    const [payments, vets] = await Promise.all([
      Payment.findAll({
        attributes: await getPaymentAttributes([
          "id",
          "farmer_id",
          "vet_id",
          "appointment_id",
          "amount",
          "payment_method",
          "payment_provider",
          "payment_status",
          "created_at"
        ]),
        include: [
          {
            model: Appointment,
            as: "appointment",
            attributes: ["id", "status", "appointment_date", "appointment_time"]
          }
        ],
        order: [["created_at", "DESC"]]
      }),
      Vet.findAll({
        include: [{ model: User, attributes: ["id", "name", "status"], required: false }],
        attributes: ["id", "user_id", "specialization", "experience_years"]
      })
    ]);

    const vetIds = vets.map((vet) => vet.id);
    let ratingsByVetId = new Map();
    try {
      ratingsByVetId = await getVetRatingsSummaryByVetIds(vetIds);
    } catch (ratingsErr) {
      console.warn("Vet recommendation ratings unavailable:", ratingsErr.message);
    }

    let data = null;
    let source = "ml_api";
    try {
      const mlApiBase = process.env.ML_API_URL || "http://127.0.0.1:8001";
      const response = await fetch(`${mlApiBase}/payments/recommend-vets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: req.user.id,
          payments: payments.map((payment) => ({
            farmer_id: payment.farmer_id,
            vet_id: payment.vet_id,
            amount: Number(payment.amount) || 0,
            payment_method: payment.payment_method || null,
            payment_provider: payment.payment_provider || null,
            payment_status: payment.payment_status || null,
            appointment_status: payment.appointment?.status || null,
            created_at: payment.created_at
          })),
          vets: vets.map((vet) => ({
            vet_id: vet.id,
            user_id: vet.user_id,
            vet_name: vet.User?.name || "Unknown Vet",
            specialization: vet.specialization || null,
            average_rating: Number(ratingsByVetId.get(vet.id)?.average_rating) || 0,
            review_count: Number(ratingsByVetId.get(vet.id)?.review_count) || 0
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`ML API error (${response.status})`);
      }

      data = await response.json();
    } catch (err) {
      source = "rule_fallback";
      data = buildFallbackVetRecommendations({
        farmerId: req.user.id,
        payments,
        vets,
        ratingsByVetId
      });
    }

    await logAction(
      req.user.id,
      `Farmer vet recommendation success in ${Date.now() - startedAt}ms`,
      { actionType: "read", module: "ai", ipAddress: req.ip }
    );

    return res.json({
      data,
      source,
      disclaimer: "Recommendations are advisory and based on historical payments, consultations, and vet ratings."
    });
  } catch (err) {
    await logAction(req.user?.id || null, `Farmer vet recommendation failed in ${Date.now() - startedAt}ms: ${err.message}`, {
      actionType: "error",
      module: "ai",
      ipAddress: req.ip
    });
    return res.status(500).json({ error: err.message });
  }
};

import fs from "fs";
import path from "path";
import { Op, fn, col } from "sequelize";
import AiPredictionLog from "../../models/aiPredictionLog.model.js";
import Case from "../../models/case.model.js";
import Vet from "../../models/vet.model.js";
import User from "../../models/user.model.js";
import SystemLog from "../../models/systemLog.model.js";
import Payment from "../../models/payment.model.js";
import { getPaymentAttributes } from "../../utils/paymentSchema.js";

const toCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const getAiUsageSummary = async (req, res) => {
  try {
    const totalPredictions = await AiPredictionLog.count();
    const topDiseases = await AiPredictionLog.findAll({
      attributes: ["predicted_disease", [fn("COUNT", col("id")), "count"]],
      group: ["predicted_disease"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10
    });

    const datasetSize = await Case.count();
    const modelInfo = {
      model_name: process.env.ML_MODEL_NAME || "default-model",
      model_version: process.env.ML_MODEL_VERSION || "unknown",
      date_trained: process.env.ML_MODEL_TRAINED_AT || null,
      dataset_size: Number(process.env.ML_DATASET_SIZE || datasetSize)
    };

    res.json({
      total_predictions: totalPredictions,
      most_predicted_diseases: topDiseases,
      accuracy_rate: null,
      accuracy_tracking_enabled: false,
      model: modelInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPredictionLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const logs = await AiPredictionLog.findAll({
      include: [
        { model: Case, attributes: ["id", "title"], required: false },
        {
          model: Vet,
          as: "vet",
          attributes: ["id", "user_id"],
          required: false,
          include: [{ model: User, attributes: ["id", "name"], required: false }]
        }
      ],
      order: [["created_at", "DESC"]],
      limit
    });

    res.json({ data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAiOpsLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const logs = await SystemLog.findAll({
      where: {
        module: "ai",
        [Op.or]: [{ action: { [Op.like]: "AI prediction%" } }, { action_type: "error" }]
      },
      order: [["created_at", "DESC"]],
      limit
    });
    res.json({ data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrainingDatasetRecords = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 200), 1000);
    const rows = await Case.findAll({
      attributes: ["id", "title", "description", "symptoms", "priority", "status", "created_at", "updated_at"],
      order: [["updated_at", "DESC"]],
      limit
    });
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDataQualitySummary = async (req, res) => {
  try {
    const totalCases = await Case.count();
    const missingSymptoms = await Case.count({
      where: {
        [Op.or]: [{ symptoms: null }, { symptoms: "" }]
      }
    });
    const missingDescription = await Case.count({
      where: {
        [Op.or]: [{ description: null }, { description: "" }]
      }
    });

    res.json({
      total_cases: totalCases,
      missing_symptoms: missingSymptoms,
      missing_description: missingDescription,
      data_completeness_percent: totalCases > 0 ? Number((((totalCases - missingSymptoms) / totalCases) * 100).toFixed(2)) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportCasesCsv = async (req, res) => {
  try {
    const rows = await Case.findAll({
      attributes: ["id", "title", "description", "symptoms", "priority", "status", "created_at", "updated_at"],
      order: [["updated_at", "DESC"]]
    });

    const headers = ["id", "title", "description", "symptoms", "priority", "status", "created_at", "updated_at"];
    const lines = [headers.join(",")];
    rows.forEach((row) => {
      const data = row.toJSON();
      lines.push(headers.map((key) => toCsvValue(data[key])).join(","));
    });

    const fileName = `cases_export_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(lines.join("\n"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportPaymentsCsv = async (req, res) => {
  try {
    const headers = await getPaymentAttributes([
      "id",
      "farmer_id",
      "vet_id",
      "appointment_id",
      "amount",
      "payment_method",
      "payment_provider",
      "payment_status",
      "payment_reference_number",
      "transaction_reference",
      "created_at",
      "updated_at",
      "verified_at"
    ]);
    const rows = await Payment.findAll({
      attributes: headers,
      order: [["updated_at", "DESC"]]
    });

    const lines = [headers.join(",")];
    rows.forEach((row) => {
      const data = row.toJSON();
      lines.push(headers.map((key) => toCsvValue(data[key])).join(","));
    });

    const fileName = `payments_export_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(lines.join("\n"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadModelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Model file is required" });
    }

    const absolutePath = path.resolve(req.file.path);
    const stats = fs.statSync(absolutePath);
    res.json({
      message: "Model file uploaded. Activation is managed by ML service deployment.",
      file: {
        original_name: req.file.originalname,
        stored_as: req.file.filename,
        path: absolutePath,
        size_bytes: stats.size,
        uploaded_at: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

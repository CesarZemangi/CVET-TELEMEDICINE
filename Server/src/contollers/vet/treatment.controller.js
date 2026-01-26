import db from "../../config/db.js"

export const createPrescription = async (req, res) => {
  const { case_id, medication, dosage } = req.body

  await db.query(
    "INSERT INTO prescriptions (case_id, vet_id, medication, dosage) VALUES (?, ?, ?, ?)",
    [case_id, req.user.id, medication, dosage]
  )

  res.status(201).json({ message: "Prescription created" })
}

export const createTreatmentPlan = async (req, res) => {
  const { case_id, plan } = req.body

  await db.query(
    "INSERT INTO treatment_plans (case_id, vet_id, plan) VALUES (?, ?, ?)",
    [case_id, req.user.id, plan]
  )

  res.status(201).json({ message: "Treatment plan created" })
}

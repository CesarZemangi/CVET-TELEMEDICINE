import { Op } from "sequelize";
import MedicationHistory from "../models/medicationHistory.model.js";

export const syncLabResultToMedicationHistory = async ({
  labRequest,
  result,
  actorUserId,
  actorLabel,
  transaction
}) => {
  const caseId = Number(labRequest?.Case?.id || labRequest?.case_id);
  const animalId = Number(labRequest?.Case?.animal_id);
  const vetId = Number(labRequest?.vet_id);

  if (!caseId || !animalId || !vetId) {
    throw new Error("Lab request is missing case, animal, or vet information");
  }

  const marker = `[LAB_RESULT_REQUEST:${labRequest.id}]`;
  const medicationName = `Lab Result: ${labRequest.test_type}`;
  const noteText = [
    marker,
    `${actorLabel} uploaded a lab result for ${labRequest.test_type}.`,
    `Result: ${result}`
  ].join("\n");

  const existingHistory = await MedicationHistory.findOne({
    where: {
      case_id: caseId,
      animal_id: animalId,
      vet_id: vetId,
      medication_name: medicationName,
      notes: { [Op.like]: `%${marker}%` }
    },
    transaction
  });

  if (existingHistory) {
    await existingHistory.update({
      dosage: "N/A",
      start_date: new Date(),
      notes: noteText,
      updated_by: actorUserId
    }, { transaction });

    return existingHistory;
  }

  return MedicationHistory.create({
    animal_id: animalId,
    case_id: caseId,
    vet_id: vetId,
    medication_name: medicationName,
    dosage: "N/A",
    start_date: new Date(),
    end_date: null,
    notes: noteText,
    created_by: actorUserId,
    updated_by: actorUserId
  }, { transaction });
};

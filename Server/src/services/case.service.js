import { Case, Vet, User, Animal } from "../models/associations.js";

export const getCaseListForUser = async (role, user_id) => {
  try {
    let whereClause = {};
    
    if (role === 'vet') {
      const vetRecord = await Vet.findOne({ where: { user_id } });
      if (!vetRecord) return [];
      whereClause = { vet_id: vetRecord.id };
    } else if (role === 'farmer') {
      whereClause = { farmer_id: user_id };
    }
    
    const cases = await Case.findAll({
      where: whereClause,
      attributes: ['id', 'title', 'status', 'priority'],
      order: [['created_at', 'DESC']],
      raw: true
    });
    
    return cases;
  } catch (err) {
    console.error('Error getting case list:', err);
    return [];
  }
};

export const getCasesByVet = async (user_id) => {
  try {
    const vetRecord = await Vet.findOne({ where: { user_id } });
    if (!vetRecord) return [];
    
    const cases = await Case.findAll({
      where: { vet_id: vetRecord.id },
      attributes: ['id', 'title', 'status', 'priority', 'animal_id'],
      include: [
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return cases.map(c => {
      const caseObj = c.toJSON ? c.toJSON() : c;
      return caseObj;
    });
  } catch (err) {
    console.error('Error getting vet cases:', err);
    return [];
  }
};

export const getCasesByFarmer = async (user_id) => {
  try {
    const cases = await Case.findAll({
      where: { farmer_id: user_id },
      attributes: ['id', 'title', 'status', 'priority'],
      order: [['created_at', 'DESC']],
      raw: true
    });
    
    return cases;
  } catch (err) {
    console.error('Error getting farmer cases:', err);
    return [];
  }
};

export const getCaseWithDetails = async (case_id, user_id, role) => {
  try {
    let whereClause = { id: case_id };
    
    if (role === 'vet') {
      const vetRecord = await Vet.findOne({ where: { user_id } });
      if (!vetRecord) return null;
      whereClause.vet_id = vetRecord.id;
    } else if (role === 'farmer') {
      whereClause.farmer_id = user_id;
    }
    
    const singleCase = await Case.findOne({
      where: whereClause,
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ]
    });
    
    return singleCase;
  } catch (err) {
    console.error('Error getting case with details:', err);
    return null;
  }
};

export const getAllCasesForAdmin = async () => {
  try {
    const cases = await Case.findAll({
      include: [
        { model: User, as: 'farmer', attributes: ['id', 'name'] },
        { 
          model: Vet, 
          as: 'vet',
          attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Animal, attributes: ['id', 'tag_number', 'species'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return cases.map(c => {
      const caseJson = c.toJSON();
      if (caseJson.vet) {
        caseJson.vet = {
          id: caseJson.vet.id,
          name: caseJson.vet.User?.name,
          user_id: caseJson.vet.User?.id
        };
      }
      return caseJson;
    });
  } catch (err) {
    console.error('Error getting all cases for admin:', err);
    return [];
  }
};

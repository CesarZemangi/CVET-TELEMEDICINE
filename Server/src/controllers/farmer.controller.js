import { Farmer, User, Case, Consultation } from "../models/associations.js";

export const getFarmerDashboard = async (req, res) => {
  try {
    const farmerData = await Farmer.findOne({ where: { user_id: req.user.id } });
    const activeCases = await Case.count({ where: { farmer_id: req.user.id, status: 'open' } });
    const pendingConsultations = await Consultation.count({ 
      include: [{ model: Case, where: { farmer_id: req.user.id } }],
      where: { status: 'scheduled' }
    });

    res.status(200).json({
      totalAnimals: farmerData?.livestock_count || 0,
      activeCases,
      pendingConsultations,
      healthAlerts: 0 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivestock = async (req, res) => {
  try {
    const farmerData = await Farmer.findOne({ where: { user_id: req.user.id } });
    res.status(200).json({ 
      success: true, 
      livestock_count: farmerData?.livestock_count || 0,
      data: [] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

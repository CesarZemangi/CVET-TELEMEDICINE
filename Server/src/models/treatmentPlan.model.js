const TreatmentPlan = sequelize.define('TreatmentPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  case_id: { type: DataTypes.INTEGER },
  plan_details: { type: DataTypes.TEXT },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE }
}, { tableName: 'treatment_plans', timestamps: false });

module.exports = TreatmentPlan;

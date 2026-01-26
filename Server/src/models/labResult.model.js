const LabResult = sequelize.define('LabResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  lab_request_id: { type: DataTypes.INTEGER },
  result_summary: { type: DataTypes.TEXT },
  file_url: { type: DataTypes.STRING },
  reported_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'lab_results', timestamps: false });

module.exports = LabResult;

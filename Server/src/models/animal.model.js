const Animal = sequelize.define('Animal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER },
  tag_number: { type: DataTypes.STRING },
  species: { type: DataTypes.STRING },
  breed: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  health_status: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'animals', timestamps: false });

module.exports = Animal;

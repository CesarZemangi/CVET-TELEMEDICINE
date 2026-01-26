const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sender_id: { type: DataTypes.INTEGER },
  receiver_id: { type: DataTypes.INTEGER },
  content: { type: DataTypes.TEXT },
  read_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'messages', timestamps: false });

module.exports = Message;

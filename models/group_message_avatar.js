module.exports = (sequelize, Sequelize) => {
  const group_message_avatar = sequelize.define(
    'group_message_avatar',
    {
      group_message_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        reference: {
          model: 'group_message',
          key: 'id'
        },
        primaryKey: true
      },
      image_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        reference: {
          model: 'image',
          key: 'id'
        }
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'group_message_avatar'
    }
  )
  return group_message_avatar
}

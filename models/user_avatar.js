module.exports = (sequelize, Sequelize) => {
  const user_avatar = sequelize.define(
    'user_avatar',
    {
      user_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        reference: {
          model: 'user',
          key: 'id'
        }
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
      tableName: 'user_avatar'
    }
  )
  return user_avatar
}

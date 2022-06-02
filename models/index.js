const Sequelize = require('sequelize')

const sequelize = new Sequelize('socialviuni', 'root', 'socialviuni', {
  host: 'socialviuni.cqxwfymphxwv.ap-southeast-1.rds.amazonaws.com',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => console.log('Connected successfully'))
  .catch((err) => console.log('Connection failed:', err))

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user')(sequelize, Sequelize)
db.user_avatar = require('./user_avatar')(sequelize, Sequelize)
db.image = require('./image')(sequelize, Sequelize)
db.message = require('./message')(sequelize, Sequelize)
db.group_message = require('./group_message')(sequelize, Sequelize)
db.group_message_avatar = require('./group_message_avatar')(
  sequelize,
  Sequelize
)
db.member_group_message = require('./member_group_message')(
  sequelize,
  Sequelize
)
db.chat_group_message = require('./chat_group_message')(sequelize, Sequelize)

module.exports = db

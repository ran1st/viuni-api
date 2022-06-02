module.exports = (sequelize, Sequelize) => {
    const message = sequelize.define('message', {
        id: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        created_date: {
            type: Sequelize.DATE(6),
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_source_id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            reference: {
                model: 'user',
                key: 'id'
            }
        },
        user_target_id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            reference: {
                model: 'user',
                key: 'id'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'message'
    })
    return message
}
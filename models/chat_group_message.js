module.exports = (sequelize, Sequelize) => {
    const chat_group_message = sequelize.define('chat_group_message', {
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
        group_message_id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            reference: {
                model: 'group_message',
                key: 'id'
            }
        },
        member_id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            reference: {
                model: 'member_group_message',
                key: 'id'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'chat_group_message'
    })
    return chat_group_message
}
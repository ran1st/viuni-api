module.exports = (sequelize, Sequelize) => {
    const member_group_message = sequelize.define('member_group_message', {
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
        admin: Sequelize.BOOLEAN,
        group_message_id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            reference: {
                model: 'group_message',
                key: 'id'
            }
        },
        user_id: {
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
        tableName: 'member_group_message'
    })
    return member_group_message
}
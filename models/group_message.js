module.exports = (sequelize, Sequelize) => {
    const group_message = sequelize.define('group_message', {
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
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        author_id: {
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
        tableName: 'group_message'
    })
    return group_message
}
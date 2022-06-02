module.exports = (sequelize, Sequelize) => {
    const image = sequelize.define('image', {
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
        link_image: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'image'
    })
    return image
}
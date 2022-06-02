module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
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
        active: Sequelize.BOOLEAN,
        dob: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        first_name: {
            type: Sequelize.STRING(15),
            allowNull: false
        },
        gender: Sequelize.BOOLEAN,
        last_name: {
            type: Sequelize.STRING(25),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING(15),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'user'
    })
    return user
}
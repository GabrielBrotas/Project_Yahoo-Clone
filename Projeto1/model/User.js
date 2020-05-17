const Sequelize = require('sequelize')
const connection = require('../control/database')


// criar table User
const User = connection.define('users', {

    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false

    },
    eAdmin: {
        type: Sequelize.SMALLINT,
        
    }

})

User.sync({force: false})

module.exports = User

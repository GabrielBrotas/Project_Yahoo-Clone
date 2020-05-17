const Sequelize = require('sequelize')
const connection = require('../control/database')

const Answer = connection.define('answer', {

    // corpo onde vai ficar salva a resposta
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    },

    // pegar o id da pergunta para qual essa resposta responde, criar um relacionamento entre as tables onde nessa vai ficar armazenado a chave primaria do model de Question
    question: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }

})

Answer.sync({force: false})

module.exports = Answer
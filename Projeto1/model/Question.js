// models é algo que vai representar nossas tabelas, nossa estrutura dedos

const Sequelize = require('sequelize')

const connection = require('../control/database')

/*
 const Question =variavel que vai receber nosso model

 connection.define('question') = no banco de dados criar a table 'questions' e passar os dados pelo json

*/

const Question = connection.define('question', {

    titulo: {
        type: Sequelize.STRING,
        allowNull: false // nao permite vazio
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    
});

// Criar a tabela e caso ja exista nao sobrepor ela
Question.sync({force: false})

module.exports = Question;
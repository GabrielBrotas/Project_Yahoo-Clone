/* 
Arquivo que vai ficar a conexao com o sequelize
*/

const Sequelize = require('sequelize')


/*
    Criar um banco de dados para trabalhar

    no cmd digitar

        >mysql -h localhost -u root -p
        digitar a senha

    criar db:
                        nome do DB para esse APP
        >create database guiaperguntas;
    
*/

const connection = new Sequelize('guiaperguntas', 'root', '<sua senha>', {
    host: 'localhost', // local que esta rodando
    dialect: 'mysql'   // banco de dados 
})


// exportar o database
module.exports = connection;

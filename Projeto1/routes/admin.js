
const express = require('express')
const router = express.Router()

// importar model de perguntas
const Question = require('../model/Question')

// importar model de perguntas
const Answer = require('../model/Answer')

const {isAuth} = require('../control/helpers')

var mysql = require('mysql2')

router.get('/ask', isAuth, (req, res) => {

    res.render('ask')

})


router.post('/addQuestion', isAuth, (req, res) => {
    
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    // create() = funcao equivalente a 'INSERT INTO question e dentro das chaves {} vai ficar os valores
    Question.create({
        titulo: titulo,
        descricao: descricao
    }).then( () => {

        res.redirect('/')

    }).catch( (err) => {

        res.send('erro ao salvar dados')

    })

})


router.post('/answer', isAuth,(req, res) => {

    var body = req.body.body
    var questionID = req.body.questionID

    // colocar as variaveis no model Answer
    Answer.create({
        body: body,
        question: questionID
    }).then( () => {
        res.redirect('/question/' + questionID)
    })

})


router.post('/delete/:id', (req, res) => {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Gabriel22*/",
        database: "guiaperguntas"
      });
      
      con.connect(function(err) {
        if (err) throw err;
        var sql = "DELETE FROM questions WHERE id = " + req.params.id;
        
        con.query(sql, function (err, result) {
          if (err) throw err;
          req.flash('success_msg', 'Mensagem deletada com sucesso')
          res.redirect('/')
        });
      });
    
    

})


module.exports = router;
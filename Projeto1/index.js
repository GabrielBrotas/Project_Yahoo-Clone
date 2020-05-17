/*
    Para esse projeto vamos utilizar o:
    
    -express
    -MySQL
    -Bootstrap <- baixar os arquivos css e js e extrair na pasta public
    -EJS (template engine, vai desenhar o html, vai fazer o processo de renderizaçao da rota no estilo html)
    -body-parser <-(pegar dados de formularios e traduzir em estrutura javaScript)
    -sequelize <- biblioteca para trabalhar com mysql ou outros bancos de dados como MariaDB, SQlite
    -mysql2 <- biblioteca para integrar o sequelize e o mysql
    no diretorio do projeto vamos instalar:
    -express-session    <- sessao de usuario
    -connect-flash  <- mostrar meensagem temporaria
    -bcryptjs   <-gerar senhas hash
    -passport   <- pegar o pacotes de autenticacao
    -passport-local <- pegar a estrategia de autenticacao local

    >npm install express --save
    >npm install ejs --save
    >npm install body-parser --save
    >npm install sequelize --save
    >npm install mysql2 --save
    >npm install --save express-session
    >npm install --save connect-flash
    >npm install --save bcryptjs    

    >npm install --save  passport   

    >npm install --save  passport-local 
*/



// todo, *** IMPORTANDO MODULOS ***

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// importar DB
const connection = require('./control/database')

// chamar as rotas admin
const admin = require('./routes/admin')

// importar model de perguntas
const Question = require('./model/Question')

// importar model de respostas
const Answer = require('./model/Answer')

// importar model de usuarios
const User = require('./model/User')

// hash senha
const bcrypt = require('bcryptjs')

// mensagem de erro
const flash = require('connect-flash')

// Carregar o modulo de sessions para guardar o usuario que esta logado
const session = require('express-session')

const passport = require('passport')
require('./control/auth')(passport)




// todo, *** CONFIGURANDO DATABASE ***

    // verificando a autenticacao com o DB
    connection.authenticate().then( () => {

        console.log('conectado ao database')

    }).catch( (err) => {

        console.log('erro ao se conectar com o database' + err)

    })



// todo, *** CONFIGURANDO APP ***

    /* 
    * View do HTML
    informando que o renderizador de html(view engine) vai ser o 'ejs', poderia ser o handlebars ou outro...
    
    E todos os nossos arquivos html vai ter que ficar salvo na pasta views que vamos criar, é a pasta que o express vai pegar os arquivo
    */
        app.set('view engine', 'ejs')

    /*
     * Arquivos estaticos
     Arquivos estaticos são aqueles que nao vao sofrer alteraçoes como imagens, front end, css, etc..
     aqui vamos informar qual pasta vai ficar esses arquivos, por padrao do mercado é a pasta 'public'
    */
        app.use(express.static('public'));

    /*
     * Body-Parser
        Ele vai decodificar os dados em estrutura javaScript, para pegar os dados de formulario html (ejs) temos que dar nomes aos campos (inputs),
        vai liberar a funcao req.body.<nome do input/campo>
     */
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    // * Sessao + flash
        app.use(session({
            secret: 'YahooClone',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())

        app.use(passport.session())
        
        app.use(flash())
     
    // * CONFIG do Middleware
        /*
        o middleware pega 3 parametros (request, response, next)
        vamos criar variaveis globais dentro dessa funcao para poder acessar por qualquer parte da applicação
        Nesse caso vamos criar uma para aparecer uma mensagem de sucesso quando o usuario cadastrar uma postagem

            res.local.<nome da variavel> é a funcao para criar variaveis globais
            next()
            */
           app.use( (req, res, next) => {
        
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.user = req.user || null
    
            next()
        })

    



// todo, *** ROTAS ***


    app.get('/', (req, res) => {
        console.log(req.user)
        /* 
         findAll equivalente a "select * from questions"
         o parametro {raw: true} vai mandar trazer os dados 'cru' apenas os valores que foram passados para o dado
         depois que listar as perguntas renderizar a index e passar a lista de perguntas
         order[['id', 'desc']] => 'order by id' de forma decrescente

        */
        Question.findAll({raw: true, order: [['id', 'desc']]}).then( (perguntas) => {
            
            res.render('index', {perguntas: perguntas})

        }).catch( (err) => {
            req.flash('error_msg', 'erro ao carregar postagens')
            res.redirect('/')
        })
        

    })

    
    app.get('/question/:id', (req, res) => {

        var id = req.params.id

        // verificar se o id existe no model Question

        Question.findOne({
            // buscar no banco de dados o id que é igual ao id passado
            where: {id: id}
        }).then( (question) => {

            // caso tenha a pergunta
            if (question != undefined) {

                Answer.findAll({
                    raw: true,
                    order: [['id', 'desc']],
                    where: {question: id}

                }).then( (answer) => {
                   
                    res.render('question', {question: question, answer: answer})

                }).catch( (err) => {

                    res.send('erro ao carregar respostas')

                })

            } else { 

                res.redirect('/')

            }

        })

    })


    app.get('/register', (req, res) => {    

        res.render('register')

    })

    
    app.post('/addregister', (req, res) => {

        var username = req.body.username
        var email = req.body.email
        var password = req.body.password
        var confirm_password = req.body.confirm_password
    
        if(password != confirm_password){
            req.flash('error_msg', "senhas divergentes")
            res.redirect('/register')
        } else {
           
            User.findOne( {where: {email: req.body.email}} ).then( (usuario) => {
                
                if(usuario){
                    
                    req.flash('error_msg', 'email ja cadastrado no sistema')
                    res.redirect('/register')

                } else {

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (erro, hash) => {
                            
                            if(erro) {
                                req.flash('error_msg', 'erro ao criar uma nova conta')
                                res.redirect('/')
                            }

                            User.create({
                                username: username,
                                email: email,
                                password: hash

                            }).then( () => {
            
                                req.flash('success_msg', 'cadastrado com sucesso')
                                res.redirect('/')
            
                            }).catch( (err) => {
            
                                req.flash('error_msg', 'erro ao cadastrar usuario')
                                res.redirect('/')
            
                            })

                        })
                    })     
                }
            })
        }
    })

    app.get('/login', (req, res) => {

        res.render('login')

    })

    app.post('/login', (req, res, next) => {
        // req.flash('success_msg', 'logado com sucesso')
        // res.redirect('/')
    
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next)
    
    })

    app.get('/logout', (req, res, next) => {
        req.logout()
        req.flash('success_msg', 'Deslogado!')
        res.redirect('/')
    })

    app.use('/admin', admin)

    
// todo, *** RODANDO SERVIDOR ***

app.listen(8081, () => {

    console.log('app runing na porta 8081')

})
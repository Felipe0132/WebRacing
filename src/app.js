const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // Front
const corridaRoutes = require('./api/routes/corridaRoutes')
const userRoutes = require('./api/routes/userRoutes')
const authRoutes = require('./api/routes/authRoutes')
const config = require('./config')
const session = require('express-session')
const passport = require('passport')
require('./config/passport') 

const app = express()

app.use(express.json()) // Transforma as req em JSON
app.use(cors()) // Se o Front pode falar com o Back

// Login Google

app.use(session({ // Para a sessao se lembrar do usuario
    secret: process.env.SESSION_SECRET, // Chave do cookie
    resave: false, // So atualiza se houver mudanca
    saveUninitialized: false, // Precisa da conta para criar sessao, assim nao salva nada de quem nao loga
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // durar 1 dia
}))

app.use(passport.initialize()) // Inicia o passport
app.use(passport.session())  // Ele que chama o deserializacao e requisicoes do user

// Rotas

app.use('/corridas', corridaRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

// Data Base

mongoose.connect(config.databaseURL).then(() => { // Conecta ao Banco primeiro
    app.listen(config.port, () => console.log(`Servidor rodando na porta ${config.port}`)) // So le e abre o DB se conectar, pelo .then()
  }).catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err)
    process.exit(1)
  })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // Front
const corridaRoutes = require('./api/routes/corridaRoutes')
const config = require('./config')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/corridas', corridaRoutes)

mongoose.connect(config.databaseURL).then(() => {
    console.log('MongoDB conectado!')
    app.listen(config.port, () => console.log(`Servidor rodando na porta ${config.port}`))
  }).catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err)
    process.exit(1)
  })

const express = require('express')
const db = require('./database') // Importando o banco
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/corridas', function(req, res) { // Busca todos

    const {nome, data, distancia, local} = req.query

    let corridas = db.prepare('SELECT * FROM corridas').all()

    if(nome){
        corridas = db.prepare('SELECT * FROM corridas WHERE nome LIKE ?').all(`%${nome}%`)
    }

    if(data){
        corridas = db.prepare(`SELECT * FROM corridas WHERE strftime('%m', data) = ?`).all(data)
    }

    if(local){
        corridas = db.prepare('SELECT * FROM corridas WHERE local LIKE ?').all(`%${local}%`)
    }

    if(distancia){
        corridas = db.prepare(`
            SELECT corridas.* FROM corridas
            JOIN distancias ON distancias.corrida_id = corridas.id
            WHERE distancias.km = ?
        `).all(Number(distancia)) // Aqui ele entra nas tabelas de corrida, acha as que tem a distancia desejada, retorna o id que tem a corrida ligada
    }
    
    const corridasCompletas =  corridas.map(function(corrida){
        const kms = db.prepare('SELECT km FROM distancias WHERE corrida_id = ?').all(corrida.id)

        return{...corrida, distancias: kms.map(function(d){return d.km})}
    })

    res.json(corridasCompletas) 
})

app.post('/corridas', function(req, res){
    const{ nome, data, distancias, local } = req.body // Pega esses dados do body usadno destructing

    if(!nome || !data || !local || !distancias){ // Nao permite nulls
        return res.status(400).json({erro: 'Todos campos obrigatorios!'})
    }

    if(!Array.isArray(distancias) || distancias.length == 0){ // Se nao tiver distancia
        return res.status(400).json({erro: 'Distancia nao valida!'})
    }

    const criandoCorrida = db.prepare(`
        INSERT INTO corridas (nome, data, local)
        VALUES (?, ?, ?) 
    `)

    const ligandoDistancia = db.prepare(`
        INSERT INTO distancias (corrida_id, km)
        VALUES (?, ?)
    `)

    const cadastrar = db.transaction(function(){
        const resultado = criandoCorrida.run(nome, data, local)
        const corridaID = resultado.lastInsertRowid

        for( const distancia of distancias){
            ligandoDistancia.run(corridaID, distancia)
        }

        return corridaID
    })
    // Criou a corrida e depois colocou as distancias na tabela e ligou ela ah uma corrida

    const corridaID = cadastrar()

    const corrida = db.prepare('SELECT * FROM corridas WHERE id = ?').get(corridaID) // Vai receber a corrida com o ID criado agora
    const kms = db.prepare('SELECT km FROM distancias WHERE corrida_id = ?').all(corridaID) // Liga os kms na corrida cria

    res.status(201).json({...corrida, distancias: kms.map(function(d) { return d.km }) }) // Os ... serve para entrar nos atributos da corrida mais rapido
})

app.put('/corridas/:id', function(req, res) { // Edita por ID
    const { id } = req.params
    const { nome, data, distancias, local } = req.body

    if(!nome || !data || !local || !distancias || !id){ // Nao permite nulls
        return res.status(400).json({erro: 'Todos campos obrigatorios!'})
    }

    if(!Array.isArray(distancias) || distancias.length == 0){ // Se nao tiver distancia
        return res.status(400).json({erro: 'Distancia nao valida!'})
    }

    const corrida = db.prepare('SELECT * FROM corridas WHERE id = ?').get(id)

    if(!corrida){
        return res.status(404).json({ erro: 'Corrida não encontrada' })
    }

    const criandoCorridaNova = db.prepare(`
        UPDATE corridas SET nome = ?, data = ?, local = ?
        WHERE id = ?
    `)

    const ligandoDistanciaNova = db.prepare(`
        INSERT INTO distancias (corrida_id, km)
        VALUES (?, ?)
    `)

    const atualizar = db.transaction(function(){
        criandoCorridaNova.run(nome, data, local, id)

        db.prepare('DELETE FROM distancias WHERE corrida_id = ?').run(id) // Remove as distancias antigas

        for( const distancia of distancias){ // Criando as distancias novas
            ligandoDistanciaNova.run(id, distancia)
        }

    })

    atualizar()

    const corridaNova = db.prepare('SELECT * FROM corridas WHERE id = ?').get(id)
    const kms = db.prepare('SELECT km FROM distancias WHERE corrida_id = ?').all(id)

    res.status(200).json({...corridaNova, distancias: kms.map(function(d) { return d.km }) })
})

app.delete('/corridas/:id', function(req, res) {
    const {id} = req.params

    db.prepare('DELETE FROM distancias WHERE corrida_id = ?').run(id)
    db.prepare('DELETE FROM corridas WHERE id = ?').run(id)

    res.status(204).end()
})


app.listen(3000, function() {
    console.log('Servidor rodando em http://localhost:3000')
})
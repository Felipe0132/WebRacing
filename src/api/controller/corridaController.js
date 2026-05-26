const CorridaService = require('../../service/corridaService')

const corridaService = new CorridaService()

const create = async(req, res) => {
    try{
        const record = await corridaService.create(req.body) // Cria no Service
        return res.status(201).json(record)
    }catch(e){
        return res.status(400).json({error: e.message})
    }
}

const buscar = async(req, res) => {
    try{
        const { nome, dia, mes, ano, local, distancia } = req.query
        const filtros = {}
        const condicoesData = []

        if (nome) {
            filtros.nome = new RegExp(nome, 'i')
        }

        if (local) {
            filtros.local = new RegExp(local, 'i')
        }

        if (distancia) {
            filtros.distancias = Number(distancia)
        }

        if(dia && dia >= 1 && dia <= 31){
            condicoesData.push({$eq: [{$dayOfMonth: '$data'}, Number(dia)]})
        }

        if(mes && mes >= 1 && mes <= 12){
            condicoesData.push({$eq: [{$month: '$data'}, Number(mes) - 1]})
        }

        if(ano && ano > 0){
            condicoesData.push({$eq: [{$year: '$data'}, Number(ano)]})
        }

        if (condicoesData.length > 0) {
            filtros.$expr = { $and: condicoesData };
        }

        const records = await corridaService.busca(filtros); 
        return res.json(records)
    }catch(e){
        return res.status(404).json({ error: e.message });
    }
}

const update = async(req, res) => {
    try{
        const records = await corridaService.update(req.params.id, req.body)
        return res.json(records)
    }catch(e){
        return res.status(400).json({error: e.message})
    }
}
const remove = async(req, res) => {
    try{
        const result = await corridaService.delete(req.params.id)
        return res.json(result)
    }catch(e){
        return res.status(404).json({error: e.message})
    }
}


module.exports = {
  create, buscar, update, remove  
};
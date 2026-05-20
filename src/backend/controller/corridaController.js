const CorridaService = require('../service/corridaService')

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
        const filtros = req.query;
        const records = await corridaService.search(filtros); 
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
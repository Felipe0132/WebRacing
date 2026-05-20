const CorridaService = require('../service/corridaService')

const corridaService = new CorridaService()

const create = async(req, res, next) => {
    try{
        const corridaDTO = req.body; // Extrai o bruto da requisicao

        const corridaRecord = await corridaService.create(corridaDTO) // Passa na regra de negocios

        return res.status(201).json({ corrida: corridaRecord });
    }catch(error){
        return res.status(400).json({ message: corrida.message });
    }
}

module.exports = {
  create
};
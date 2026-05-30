const CorridaService = require('../../service/corridaService')

const corridaService = new CorridaService()

const create = async(req, res) => {
    try{
        const record = await corridaService.create(req.body) // cria os dados moo JSON
        return res.status(201).json(record)
    }catch(e){
        return res.status(400).json({error: e.message})
    }
}

const buscar = async(req, res) => {
    try{
        const { nome, dia, mes, ano, local, distancia } = req.query
        const filtros = {}

        if (nome) {
            filtros.$text = { $search: nome }; // Usa o indice do texto
        }

        if (local) {
            filtros.local = local; // Removido RegExp para usar o índice exato
        }

        if (distancia) {
            filtros.distancias = Number(distancia)
        }

        if (dia) filtros.dia = Number(dia);
        if (mes) filtros.mes = Number(mes);
        if (ano) filtros.ano = Number(ano);

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
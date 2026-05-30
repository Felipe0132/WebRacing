const UserService = require('../../service/userService')

const userService = new UserService()

const buscar = async(req, res) => {
    try{
        const {username} = req.query
        const filtros = {}
        
        if(username){
            filtros.$text = { $search: username }
        }

        const records = await userService.busca(filtros)
        return res.json(records)
    }catch(e){
        return res.status(404).json({error: e.message})
    }
}

const update = async(req, res) => {
    try{
        const id = req.user._id // Vai pegar o ID que esta logado

        const records = await userService.update(id, req.body)
        return res.json(records)
    }catch(e){
        return res.status(400).json({error: e.message})
    }
}

const remove = async(req, res) => {
    try{
        const id = req.user._id // Vai pegar o ID que esta logado
        
        const result = await userService.delete(id)
        return res.json(result)
    }catch(e){
        return res.status(404).json({error: e.message})
    }
}

module.exports = {
    findOrCreate, buscar, update, remove
};
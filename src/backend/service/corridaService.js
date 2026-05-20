const CorridaModel = require('../models/corrida');

class CorridaService{
    constructor(corridaModel = CorridaModel){
        this.corridaModel = corridaModel
    }

    async create(data){
        if (!data.nome || !data.data || !data.local || !data.link) {
            throw new Error('Dados incompletos: nome, data, local e link são obrigatórios.');
        }

        const exists = await this.corridaModel.findOne({ link: data.link }); // Verifica se existe algum com o mesmo link
        if (exists) throw new Error('Esta corrida já está cadastrada.');

        return await this.corridaModel.create(data);
    }

    async busca(filtros){ // Recebe um objeto que tem os parametros de busca
        try{
            const corridas = await this.corridaModel.find(filtros) // Se for vazio, retorna tudo
            return corridas
        }catch(error){
            throw new Error('Erro ao fazer busca')
        }
    }

    async update(id, data){
        const updated = await this.corridaModel.findByIdAndUpdate(id, data, {new: true}) // Funcao do mongoose
        if(!updated){
            throw new Error('Corrida nao foi encontrada!')
        }

        return updated
    }

    async delete(id){
        const deleted = await this.corridaModel.findByIdAndDelete(id)
        if(!deleted){
            throw new Error('Corrida nao foi encontrada!')
        }

        return {message: 'Corrida removida!'}
    }
}

module.exports = CorridaService;
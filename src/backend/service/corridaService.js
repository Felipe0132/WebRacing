const CorridaModel = require('../models/corrida');

class CorridaService{
    constructor(corridaModel = CorridaModel){
        this.corridaModel = corridaModel
    }

    async create(corridaData){
        try{ 
            if (!corridaData || !corridaData.link) {
                throw new Error('Dados insuficientes: o link da corrida é obrigatório.');
            }

            const corridaExists = await this.corridaModel.findOne({link: corridaData.link}) // Corridas com links iguais nao podem existir, entao sao iguais

            if(corridaExists){
                throw new Error('Essa corrida ja existe!')
            }

            const corridaRecord = await this.corridaModel.create(corridaData);

            return corridaRecord;
        }catch(error){
            throw error
        }
    }
}

module.exports = CorridaService;
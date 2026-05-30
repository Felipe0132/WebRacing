const mongoose = require('mongoose');

const corridaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome obrigatorio'],
        trim: true
    },

    data: {
        type: Date,
        required: [true, 'Data obrigatorio'],
        trim: true
    },

    local: {
        type: String,
        required: [true, 'Local obrigatorio'],
        trim: true
    },

    // Embedding
    distancias:{ // Distancia eh uma lista de distancias
        type: [Number], 
        required: true
    },

    link: {
        type: String,
        required: [true, 'Link obrigatorio'],
        trim: true
    }
})

corridaSchema.index({ local: 1, distancias: 1, data: 1 }); // Os indices usam a regra do ESR

corridaSchema.index({ nome: "text" }); // Procura algo parecido com o original

// Foi feito isso para otimizar a busca

const Corrida = mongoose.model('Corrida', corridaSchema);
module.exports = Corrida;
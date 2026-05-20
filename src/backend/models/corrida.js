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
    distancias: [{ // Distancia eh uma lista de distancias
        valor: { type: Number, required: true },
        unidade: { type: String, default: 'km' },
    }],

    link: {
        type: String,
        required: [true, 'Link obrigatorio'],
        trim: true
    }
})

const Corrida = mongoose.model('Corrida', corridaSchema);
module.exports = Corrida;
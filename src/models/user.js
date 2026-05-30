const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleID: {
        type: String,
        require: true,
        unique: true
    },

    username: {
        type: String,
        require: true
    },

    foto: {
        type: String,
        require: true
    },

    sexo: {
        type: String,
        enum: ['masculino', 'feminino'],
        require: false
    },

    idade: {
        type: Number,
        require: false,
        min: 0
    }
}, {timestamps: true})

userSchema.index({ username: "text" });

const User = mongoose.model('User', userSchema)
module.exports = User
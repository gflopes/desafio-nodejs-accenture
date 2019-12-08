const restful = require('node-restful')
const mongoose = restful.mongoose

const telefoneSchema = new mongoose.Schema({
    ddd: {
        type: String,
        min: 2,
        max: 2
    },
    numero: {
        type: String,
        min: 8,
        max: 9
    }
})

const geolocalizacaoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number]
    }
})

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        min: 6,
        max: 12,
        required: true
    },
    cep: {
        type: String,
        min: 8,
        max: 8,
        required: true
    },
    telefones: [telefoneSchema],
    geolocation: geolocalizacaoSchema,
    token: {
        type: String
    },
    data_criacao: {
        type: Date,
        default: Date.now
    },
    data_atualizacao: {
        type: Date,
        default: Date.now
    },
    data_ultimo_login: {
        type: Date,
        default: Date.now
    }
})

module.exports = restful.model('Usuario', usuarioSchema)
const express = require('express')

module.exports = function (server) {

    const api = express.Router()
    server.use('/api', api)

    api.get('/', function (req, res) {
        res.json({
            mensagem: 'Seja Bem-Vindo a API Desafio'
        });
    });

    const AuthService = require('../api/usuario/authService')
    const UsuarioService = require('../api/usuario/usuarioService')

    api.post('/login', AuthService.login)
    api.post('/signup', AuthService.signup)
    api.get('/usuario/:id', UsuarioService.find)
}
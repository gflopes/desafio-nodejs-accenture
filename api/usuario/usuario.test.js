const app = require('../../loader.js')
const request = require('supertest')

describe("GET /api", function () {
    it("teste da rota de apresentação da API, status code 200", function (done) {
        request(app)
            .get("/api")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
});

describe('POST /signup', function () {
    it('teste da rota de signup, usuario criado, status code esperado => 200', function (done) {
        request(app)
            .post('/api/signup')
            .send({
                email: "teste66@email.com.br",
                "password": "Blblblblbl1$",
                "confirm_password": "Blblblblbl1$",
                cep: "22730290",
                telefones: [{
                    ddd: "21",
                    numero: "123456789"
                }]
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /signup', function () {
    it('teste da rota de signup, email inexistente / inválido / senha inválida / senhas não conferem, status code esperado => 400', function (done) {
        request(app)
            .post('/api/signup')
            .send({
                email: "teste60@email.com.br",
                password: "blblblb",
                confirm_password: "blblblblbl",
                cep: "22730290",
                telefones: [{
                    ddd: "21",
                    numero: "123456789"
                }]
            })
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /login', function () {
    it('teste da rota de login, login OK, status code esperado => 200', function (done) {
        request(app)
            .post('/api/login')
            .send({
                email: "teste65@email.com.br",
                password: "Blblblblbl1$",
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /login', function () {
    it('teste da rota de login, senha incorreta, status code esperado => 401', function (done) {
        request(app)
            .post('/api/login')
            .send({
                email: "teste65@email.com.br",
                password: "blblblblbl",
            })
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /login', function () {
    it('teste da rota de login, email não encontrado, status code esperado => 404', function (done) {
        request(app)
            .post('/api/login')
            .send({
                email: 'test@email.com.br',
                password: 'blblblblblblbl'
            })
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /login', function () {
    it('teste da rota de login, erro de backend, status code esperado => 500', function (done) {
        request(app)
            .post('/api/login')
            .send({
                email: 'test@email.com.br',
                password: 'blblblblbblblbl'
            })
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /usuario/:id', function () {
    it('teste da rota de busca de usuário, busca ok, status code esperado => 200', function (done) {
        request(app)
            .get('/api/usuario/5debb9382b60c30f42a3ec26')
            .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlNTVAZW1haWwuY29tLmJyIiwiaWF0IjoxNTc1NzI5NDY0LCJleHAiOjE1NzYzMzQyNjR9.PE5HiGqjOC8vG2wx-c9omi_eh6pePmLmz_hecAIjNZc')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /usuario/:id', function () {
    it('teste da rota de busca de usuário, token / id usuário não encontrado, status code esperado => 401', function (done) {
        request(app)
            .get('/api/usuario/5debbe3b3373f1105dfc76XYZ')
            .set('authorization', 'Bearer ZZJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlNTlAZW1haWwuY29tLmJyIiwiaWF0IjoxNTc1NzMwNzQ2LCJleHAiOjE1NzYzMzU1NDZ9.3_95iInDZj_H3Bu9XVYW7qPGA0_ogSfIEzyLOLpmuIs')
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /usuario/:id', function () {
    it('teste da rota de busca de usuário, erro de backend, status code esperado => 500', function (done) {
        request(app)
            .get('/api/usuario/5debbe3b3373f1105dfc76XYZ')
            .set('authorization', 'Bearer ZZJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlNTlAZW1haWwuY29tLmJyIiwiaWF0IjoxNTc1NzMwNzQ2LCJleHAiOjE1NzYzMzU1NDZ9.3_95iInDZj_H3Bu9XVYW7qPGA0_ogSfIEzyLOLpmuIs')
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../../model/usuario");
const Geolocalizacao = require("../../util/geolocalizacao");
const env = require("../../.env");

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const mensagem = [];
  _.forIn(dbErrors.errors, error => mensagem.push(error.message));
  return res.status(400).json({
    mensagem
  });
};

const login = (req, res) => {
  const email = req.body.email || "";
  const password = req.body.password || "";

  Usuario.findOne({
      email
    },
    (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      } else if (usuario) {
        if (bcrypt.compareSync(password, usuario.password)) {
          const {
            _id,
            email,
            password,
            cep,
            telefones,
            geolocation,
            data_criacao,
            data_atualizacao,
            data_ultimo_login,
            token
          } = usuario;

          usuario.data_ultimo_login = new Date()
          usuario.save(function (err) {
            if (err) {
              return res.status(500).send({
                mensagem: "Erro na atualização da data de último login do usuário"
              })
            }
          })

          return res.json({
            _id,
            email,
            password,
            cep,
            telefones,
            geolocation,
            data_criacao,
            data_atualizacao,
            data_ultimo_login,
            token
          });
        } else {
          return res.status(401).send({
            mensagem: "Usuário e/ou Senha inválidos"
          });
        }
      } else {
        return res.status(404).send({
          mensagem: "Usuário e/ou Senha inválidos"
        });
      }
    }
  );
};

const signup = (req, res, next) => {
  const email = req.body.email || "";
  const password = req.body.password || "";
  const confirmPassword = req.body.confirm_password || "";
  const cep = req.body.cep || "";
  const telefones = req.body.telefones;

  if (!email.match(emailRegex)) {
    return res.status(400).send({
      mensagem: "O e-mail informado está inválido"
    });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      mensagem: "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-12."
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);

  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({
      mensagem: "Senhas não conferem."
    });
  }

  const token = jwt.sign({
      email: email
    },
    env.authSecret, {
      expiresIn: 604800
    }
  );

  Usuario.findOne({
      email
    },
    (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      } else if (usuario) {
        return res.status(400).send({
          mensagem: "Email já existente."
        });
      } else {
        Geolocalizacao.get({
          cep: cep
        }).then(ret => {
          console.log("geolocalizacao retorno: " + ret)
          const geolocation = JSON.parse(ret)
          const newUser = new Usuario({
            email,
            password: passwordHash,
            cep,
            telefones,
            geolocation,
            token
          });
          newUser.save(err => {
            if (err) {
              return sendErrorsFromDB(res, err);
            } else {
              login(req, res, next);
            }
          });
        })
      }
    }
  );
};

module.exports = {
  login,
  signup
};
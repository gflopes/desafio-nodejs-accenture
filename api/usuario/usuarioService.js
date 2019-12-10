const _ = require('lodash')
const Usuario = require('../../model/usuario')

Usuario.methods(['get', 'post', 'put', 'delete'])
Usuario.updateOptions({
  new: true,
  runValidators: true
})
Usuario.after("get", sendErrorsOrNext)

// tratamento de erros e parse das mensagens de erro devolvidos
function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var mensagem = parseErrors(bundle.errors)
    res.status(500).json({
      mensagem
    })
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const mensagem = []
  _.forIn(nodeRestfulErrors, error => mensagem.push(error.message))
  return mensagem
}

const find = (req, res) => {
  let token
  if (req.headers['authorization'] != null) {
    token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length)
    }
  }

  Usuario.findOne({
      token: token
    },
    function (err, tokenEncontrado) {
      if (err) {
        res.status(500).json({
          mensagem: err
        })
      } else {
        if (tokenEncontrado == null) {
          return res.status(401).send({
            mensagem: 'Não autorizado.',
          })
        } else {
          Usuario.findById(req.params.id, function (err, usuario) {
            if (err) {
              return res.status(500).send({
                mensagem: err
              })
            }

            if (usuario.token != token) {
              return res.status(401).send({
                mensagem: 'Não autorizado.',
              })
            } else {
              let today = new Date()
              let diffMs = today - usuario.data_ultimo_login
              let diffMins = Math.round(diffMs / 1000 / 60)

              // console.log("today: " + today)
              // console.log("data_ultimo_login: " + usuario.data_ultimo_login)
              // console.log("diffMins: " + diffMins)

              if (diffMins < 30) {
                return res.status(401).send({
                  mensagem: 'Sessão inválida.',
                })
              }
              return res.status(200).json({
                usuario
              })
            }
          })
        }
      }
    }
  )
}

module.exports = {
  find
}
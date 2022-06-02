const jwt = require('jsonwebtoken')
// models
const models = require('../models')
// bcrypt
const bcrypt = require('bcrypt')

const SECRET_KEY = 'thachthao'

module.exports.encode = async (req, res, next) => {
  try {
    const user = await models.user.findOne({
      where: { username: req.body.username }
    })
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const payload = { sub: user.username }
        const accessToken = jwt.sign(payload, SECRET_KEY, {
          algorithm: 'HS512',
          expiresIn: '365d'
        })
        req.token = accessToken
        next()
      } else return res.status(400).json('wrong password')
    })
  } catch (error) {
    return res.status(400).json('wrong username')
  }
}

module.exports.decode = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).json('No header bearer token')
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(400).json('No access token provided')
  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) return res.status(403).json(err.message)
    const user = await models.user.findOne({ where: { username: data.sub } })
    if (!user.active) return res.status(403).json('Account not active')
    req.user = user
    next()
  })
}

const router = require('express').Router()
// web socket
const messageWebSocket = require('../utils/messageWebSocket')
// middlewares
const { encode, decode } = require('../middlewares/jwt')

router.post('/login', encode, (req, res, next) => {
  return res.status(200).json({ token: req.token })
})
router.get('/messenger', decode, (req, res, next) => {
  //return res.status(200).json({ message: req.app.get('socket.io') })
  const io = req.app.get('socket.io')
  io.on('connection', (socket) => messageWebSocket(io, socket))
  io.emit('message', req.user)
})

module.exports = router

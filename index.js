const express = require('express')
const morgan = require('morgan')
const http = require('http')
const cors = require('cors')
const path = require('path')
// database connection
const models = require('./models')
// web socket
const messageWebSocket = require('./utils/messageWebSocket')
// routes
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const messageRouter = require('./routes/message')
const groupMessageRouter = require('./routes/groupMessage')
// middlewares
const { decode } = require('./middlewares/jwt')

const app = express()

const port = process.env.PORT || 9999
app.set('port', port)

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/users', decode, userRouter)
app.use('/message', decode, messageRouter)
app.use('/group-message', decode, groupMessageRouter)
/** Catch 404 and forward to error handler. */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
})

/** Create HTTP server. */
const server = http.createServer(app)
/** Create socket connection */
const io = require('socket.io')(server, { cors: { origin: '*' } })
const jwt = require('jsonwebtoken')
// app.set('socket.io', io)
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  const SECRET_KEY = 'thachthao'

  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) return next(new Error('Authorization Fail'))
    const user = await models.user.findOne({ where: { username: data.sub } })
    if (!user.active) return next(new Error('Account not active'))
    socket.user = user
    next()
  })
}).on('connection', (socket) => messageWebSocket(io, socket))
io.of('chat').on('connection', (socket) => messageWebSocket(io, socket))
/** Create Peer */
/** Get port from environment and store in Express. */
/** Listen on provided port, on all network interfaces. */
server.listen(port)
/** Event listener for HTTP server "listening" event. */
server.on('listening', () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ Development by Venus`)
)

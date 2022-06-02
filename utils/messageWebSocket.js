let numUsers = 0
// models
const models = require('../models')

module.exports = (io, socket) => {
  let addedUser = false

  const joinRoom = (room) => {
    socket.join(room)
    socket.roomId = room
    socket.to(room).emit('user-connected', 1)
  }

  const leaveRoom = (room) => {
    socket.leave(room)
    socket.to(room).emit('user-leaved', 1)
  }

  const peerId = (data) => {
    socket.to(socket.roomId).emit('peer id', data)
  }

  const newMessage = async (data) => {
    try {
      socket.to(socket.roomId).emit('new message', {
        id: socket.user.id,
        author: socket.user.id,
        message: data
      })
    } catch (error) {
      return console.log(error)
    }
  }

  const addUser = (username) => {
    if (addedUser) return

    // we store the username in the socket session for this client
    socket.username = username
    ++numUsers
    addedUser = true
    socket.emit('login', {
      numUsers: numUsers
    })
    // echo globally (all clients) that a person has connected
    socket.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    })
  }

  const typing = (data) => {
    socket.broadcast.emit('typing', data)
  }

  const stopTyping = () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    })
  }

  const disconnect = () => {
    if (addedUser) {
      --numUsers

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      })
    }
  }

  const message = (message) => {
    io.emit('message', message)
  }

  socket.on('peer id', peerId)
  socket.on('join room', joinRoom)
  socket.on('leave room', leaveRoom)
  socket.on('new message', newMessage)
  socket.on('add user', addUser)
  socket.on('typing', typing)
  socket.on('stop typing', stopTyping)
  socket.on('disconnect', disconnect)
  socket.on('message', message)
}

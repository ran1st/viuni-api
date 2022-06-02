const router = require('express').Router()
// controllers
const groupMessage = require('../controllers/groupMessage')

router
  .get('/', groupMessage.getAllGroupMessage)
  .get('/member/:id', groupMessage.getMemberById)
  .get('/:id', groupMessage.getMessage)
  .post('/create', groupMessage.createGroup)
  .post('/rename', groupMessage.renameGroup)
  .post('/leave', groupMessage.leaveGroup)
  .post('/:id', groupMessage.postMessage)

module.exports = router

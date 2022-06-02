const router = require('express').Router()
// controllers
const user = require('../controllers/user')
// middlewares
const { encode } = require('../middlewares/jwt')

router
  .get('/', user.getAllUser)
  .post('/', user.createUser)
  .get('/info', user.getInfoUser)
  .get('/:id', user.getUserById)
  .get('/name/:name', user.getUserByName)
  .delete('/:id', user.deleteUserById)

module.exports = router

const router = require('express').Router()
// controllers
const message = require('../controllers/message')

router
    .get('/', message.getAllUserMessage)
    .get('/search', message.getSearchUser)
    .get('/:roomId/:targetId', message.getMessageById)
    .post('/:roomId/:targetId', message.postMessage)
    
module.exports = router
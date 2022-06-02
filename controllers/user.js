const models = require('../models')

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const users = await models.user.findAll()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await models.user.findOne({ where: { id: req.params.id } })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getUserByName: async (req, res) => {
    try {
      const user = await models.user.findOne({
        where: { username: req.params.name }
      })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getInfoUser: async (req, res) => {
    try {
      const user = await models.user.findOne({
        where: { id: req.user.id }
      })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  createUser: async (req, res) => {},
  deleteUserById: async (req, res) => {}
}

const models = require('../models')

module.exports = {
  getAllUserMessage: async (req, res) => {
    try {
      const { Op } = require('@sequelize/core')
      let user_target_id = await models.message.findAll({
        attributes: ['user_source_id', 'user_target_id'],
        where: {
          [Op.or]: [
            { user_source_id: req.user.id },
            { user_target_id: req.user.id }
          ]
        },
        group: 'user_target_id'
      })
      user_target_id = user_target_id.map((user) => {
        if (user.user_source_id !== req.user.id)
          return { user_target_id: user.user_source_id }
        else return { user_target_id: user.user_target_id }
      })
      const unique = (arr) => {
        var newArr = []
        newArr = arr.filter((item) => {
          return newArr.includes(item.user_target_id)
            ? ''
            : newArr.push(item.user_target_id)
        })
        return newArr
      }
      user_target_id = unique(user_target_id)
      const users = await Promise.all(
        user_target_id.map(async (item, i) => {
          const user = await models.user.findOne({
            attributes: ['id', 'first_name', 'last_name', 'username'],
            where: { id: item.user_target_id }
          })
          const avatar = await models.user_avatar.findOne({
            attributes: ['image_id'],
            where: { user_id: item.user_target_id }
          })
          const image = await models.image.findOne({
            attributes: ['link_image'],
            where: { id: avatar.image_id }
          })
          const message = await models.message.findOne({
            attributes: ['created_date', 'content'],
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { user_source_id: req.user.id },
                    { user_target_id: item.user_target_id }
                  ]
                },
                {
                  [Op.and]: [
                    { user_source_id: item.user_target_id },
                    { user_target_id: req.user.id }
                  ]
                }
              ]
            },
            order: [['created_date', 'DESC']]
          })
          console.log(message.dataValues)
          return {
            ...user.dataValues,
            ...image.dataValues,
            ...message.dataValues,
            roomId:
              (req.user.id + user.id) * 2 +
              (req.user.id % user.id) +
              (user.id % req.user.id)
          }
        })
      )
      return res.status(200).json(users)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getSearchUser: async (req, res) => {
    try {
      const { Op } = require('@sequelize/core')
      const users = await models.user.findAll({
        where: {
          id: {
            [Op.ne]: req.user.id
          }
        }
      })
      const members = await Promise.all(
        users.map(async (user) => {
          const avatar = await models.user_avatar.findOne({
            attributes: ['image_id'],
            where: { user_id: user.id }
          })
          const image = await models.image.findOne({
            attributes: ['link_image'],
            where: { id: avatar.image_id }
          })
          return {
            ...user.dataValues,
            ...image.dataValues,
            roomId:
              (req.user.id + user.id) * 2 +
              (req.user.id % user.id) +
              (user.id % req.user.id)
          }
        })
      )
      console.log(members)
      return res.status(200).json(members)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getMessageById: async (req, res) => {
    try {
      const { Op } = require('@sequelize/core')
      const message = await models.message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user_source_id: req.user.id },
                { user_target_id: req.params.targetId }
              ]
            },
            {
              [Op.and]: [
                { user_source_id: req.params.targetId },
                { user_target_id: req.user.id }
              ]
            }
          ]
        }
      })
      const msg = await Promise.all(
        message.map(async (item) => {
          const user = await models.user.findOne({
            attributes: ['first_name', 'last_name'],
            where: { id: item.user_source_id }
          })
          return { ...item.dataValues, ...user.dataValues }
        })
      )
      return res.status(200).json(msg)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  postMessage: async (req, res) => {
    try {
      const data = {
        created_date: new Date(),
        content: req.body.content,
        user_source_id: req.user.id,
        user_target_id: req.body.user_target_id
      }
      const message = await models.message.create(data)
      console.log(message)
      return res.status(200).json(message)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  onDeleteUserById: async (req, res) => {}
}

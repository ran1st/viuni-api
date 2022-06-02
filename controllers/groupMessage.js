const models = require('../models')

module.exports = {
  getAllGroupMessage: async (req, res) => {
    try {
      const data = await models.member_group_message.findAll({
        attributes: ['group_message_id'],
        where: { user_id: req.user.id }
      })
      // const data = await models.group_message.findAll()
      const groups = await Promise.all(
        data.map(async (item, i) => {
          const group = await models.group_message.findOne({
            attributes: ['id', 'name'],
            where: { id: item.group_message_id }
          })
          const avatar = await models.group_message_avatar.findOne({
            attributes: ['image_id'],
            where: { group_message_id: item.group_message_id }
          })
          const image = await models.image.findOne({
            attributes: ['link_image'],
            where: { id: avatar.image_id }
          })
          const message = await models.chat_group_message.findOne({
            attributes: ['content', 'created_date'],
            where: {
              group_message_id: item.group_message_id
            },
            order: [['created_date', 'DESC']]
          })
          console.log(message.dataValues)
          return {
            ...group.dataValues,
            ...image.dataValues,
            ...message.dataValues
          }
        })
      )
      return res.status(200).json(groups)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getMemberById: async (req, res) => {
    try {
      const data = await models.member_group_message.findAll({
        attributes: { exclude: ['group_message_id'] },
        where: {
          group_message_id: req.params.id
        }
      })
      const members = await Promise.all(
        data.map(async (item, i) => {
          const user = await models.user.findOne({
            attributes: ['first_name', 'last_name', 'username'],
            where: { id: item.user_id }
          })
          const avatar = await models.user_avatar.findOne({
            attributes: ['image_id'],
            where: { user_id: item.user_id }
          })
          const image = await models.image.findOne({
            attributes: ['link_image'],
            where: { id: avatar.image_id }
          })
          return {
            ...data[i].dataValues,
            ...user.dataValues,
            ...image.dataValues
          }
        })
      )
      return res.status(200).json(members)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  getMessage: async (req, res) => {
    try {
      const message = await models.chat_group_message.findAll({
        where: {
          group_message_id: req.params.id
        }
      })
      res.status(200).json(message)
    } catch (error) {
      res.status(400).json('error')
    }
  },
  createGroup: async (req, res) => {
    try {
      const data = {
        created_date: new Date(),
        name: `Nhóm tạo bởi ${req.user.last_name} ${req.user.first_name}`,
        author_id: req.user.id
      }
      const group_message = await models.group_message.create(data)
      const avatar = {
        group_message_id: group_message.id,
        image_id: 1
      }
      const group_message_avatar = await models.group_message_avatar.create(
        avatar
      )
      const dataBody = Object.entries(req.body.data)
      const dataMember = dataBody.map((item) => {
        const admin = item[1].id === req.user.id ? 1 : 0
        const member = {
          created_date: new Date(),
          admin,
          group_message_id: group_message.id,
          user_id: item[1].id
        }
        return member
      })
      const member = await Promise.all(
        dataMember.map(async (item) => {
          console.log(item)
          const member_group_message = await models.member_group_message.create(
            item
          )
          console.log(member_group_message)
          return member_group_message
        })
      )
      return res.status(200).json(member)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  renameGroup: async (req, res) => {
    try {
      const group = await models.group_message.update(
        {
          name: req.body.name
        },
        {
          where: {
            id: req.body.id
          }
        }
      )
      return res.status(200).json(group)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  leaveGroup: async (req, res) => {
    try {
      const { Op } = require('@sequelize/core')
      const group = await models.member_group_message.destroy({
        where: {
          [Op.and]: [
            { group_message_id: req.body.id },
            { user_id: req.user.id }
          ]
        }
      })
      return res.status(200).json(group)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  postMessage: async (req, res) => {
    try {
      const isMemberGroup = await models.member_group_message.count({
        where: {
          group_message_id: req.params.id,
          user_id: req.user.id
        }
      })
      if (isMemberGroup) {
        const data = {
          created_date: new Date(),
          content: req.body.content,
          group_message_id: req.params.id,
          member_id: req.user.id
        }
        const message = await models.chat_group_message.create(data)
        return res.status(200).json(message)
      } else throw 'You not member in group'
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

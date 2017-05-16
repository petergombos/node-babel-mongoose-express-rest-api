import Joi from 'utils/customJoi'

export default {
  create: {
    body: {
      title: Joi.string().trim().required(),
      done: Joi.boolean()
    }
  },
  update: {
    body: {
      title: Joi.string().trim(),
      done: Joi.boolean()
    }
  }
}

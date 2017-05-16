import Joi from 'joi'

export default Joi.extend({
  name: 'objectId',
  base: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  coerce: (value, b, c) => value === '' ? null : value // eslint-disable-line
})

import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'

import APIError from 'utils/APIError'
import patchModel from 'utils/patchModel'

mongoose.Promise = Promise

class APIModel {
  constructor (name, schema) {
    this.modelName = name

    this.schema = mongoose.Schema({
      ...schema,
      ...this.defaultSchema
    })

    this.schema.pre('save', this.preSave)

    this.schema.methods = this.methods
    this.schema.statics = this.statics

    if (this.constructor.name === 'APIModel') {
      this.model = this.createModelFromSchema()
    }
  }

  defaultSchema = {
    hidden: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }

  createModelFromSchema () {
    return mongoose.model(this.modelName, this.schema)
  }

  // Lifecycle Hooks
  preSave (next) {
    const doc = this
    doc.updatedAt = new Date()
    return next()
  }

  // Methods
  methods = {
    toJSON: this.toJSON,
    hide: this.hide,
    update: this.update
  }

  toJSON () {
    const obj = this.toObject()
    delete obj.__v
    delete obj.hidden

    return obj
  }

  hide () {
    this.hidden = true
    return this.save()
  }

  update (data) {
    patchModel(this, this.constructor.schema, data)
    return this.save()
  }

  // Staticts
  statics = {
    get: this.get,
    create: this.create,
    list: this.list
  }

  get (id, populate = []) {
    const query = this.findById(id)
    populate.forEach(field =>
      query.populate(field, '-hidden')
    )
    return query.exec().then((document) => {
      if (!document || document.hidden) {
        const err = new APIError('No such document exists', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      }
      return document
    })
  }

  create (data) {
    return new this(data).save()
  }

  list (where = {}, { skip = 0, limit = 10, sort = '_id', populate = [] }) {
    const query = this.find({
      hidden: false,
      ...where
    })
    populate.forEach(field =>
      query.populate(field, '-hidden')
    )
    query.skip(parseInt(skip, 10))
    query.limit(parseInt(limit, 10))

    const sortKey = sort[0] === '-' ? sort.substr(1) : sort
    const sortValue = sort[0] === '-' ? -1 : 1
    query.sort({ [sortKey]: sortValue })

    return Promise.all([
      query.exec(),
      this.find(where).limit().skip().count().exec()
    ])
    .then(([data, count]) => ({
      data,
      count
    }))
  }
}

export default APIModel

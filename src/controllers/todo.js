import Todo from 'models/todo'

export const list = (where, options) =>
  Todo.list(where, options)

export const get = (id, populate) =>
  Todo.get(id, populate)

export const create = (payload) =>
  Todo.create(payload)

export const update = (id, payload) =>
  Todo.get(id).then(doc => doc.update(payload))

export const remove = (id) =>
  Todo.get(id).then(doc => doc.hide())

export default {
  list,
  get,
  create,
  update,
  remove
}

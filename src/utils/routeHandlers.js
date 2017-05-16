export const list = (controller) => (req, res, next) => {
  const { populate } = req.query
  controller.list({
    ...req.query,
    skip: undefined,
    limit: undefined,
    populate: undefined,
    sort: undefined
  }, {
    ...req.query,
    populate: populate ? populate.split(',') : undefined
  })
    .then((r) => res.set('X-Total-Count', r.count).send(r.data))
    .catch((e) => next(e))
}

export const create = (controller) => (req, res, next) => {
  controller.create(req.body)
    .then((r) => res.send(r))
    .catch((e) => next(e))
}

export const get = (controller) => (req, res, next) => {
  const { populate } = req.query
  controller.get(req.params.id, populate && populate.split(','))
    .then((r) => res.send(r))
    .catch((e) => next(e))
}

export const update = (controller) => (req, res, next) => {
  controller.update(req.params.id, req.body)
    .then((r) => res.send(r))
    .catch((e) => next(e))
}

export const remove = (controller) => (req, res, next) => {
  controller.remove(req.params.id)
    .then((r) => res.send(r))
    .catch((e) => next(e))
}

export default {
  list,
  create,
  get,
  update,
  remove
}

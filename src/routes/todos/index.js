import { Router } from 'express'
import validate from 'express-validation'

import { list, create, get, update, remove } from 'utils/routeHandlers'
import controller from 'controllers/todo'

import validations from './paramValidations'

const router = Router()

router.route('/')
  .get(list(controller))
  .post(validate(validations.create), create(controller))

router.route('/:id')
  .get(get(controller))
  .put(validate(validations.update), update(controller))
  .delete(remove(controller))

export default router

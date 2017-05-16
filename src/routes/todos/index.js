import { Router } from 'express'

import { list, create, get, update, remove } from 'utils/routeHandlers'
import controller from 'controllers/todo'

const router = Router()

router.route('/')
  .get(list(controller))
  .post(create(controller))

router.route('/:id')
  .get(get(controller))
  .put(update(controller))
  .delete(remove(controller))

export default router

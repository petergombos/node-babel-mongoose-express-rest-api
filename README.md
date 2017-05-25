# REST API Template
This project should make it easy to bootstrap a REST API. Babel for ES6-ES7 is set up out of the box, along with Eslint standard. Dockerfile is included for basic containerization.

## Development
Stat the dev server:
```bash
npm start
```

For TDD mocha is started with --watch, so it re-runs the tests for each file change:
```bash
npm run tdd
```

## Adding a new endpoint
### 1. Create a new Model (src/models/)
```js
import APIModel from 'utils/APIModel'

const Todo = new APIModel('Todo', {
  title: String,
  done: Boolean
})

export default Todo.model
```

### 2. Create the controller for business logic (src/controllers)
```js
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
```

### 3. Define param validations (src/routes/todos/paramValidations.js)
```js
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
```

### 4. Add new route handlers (src/routes/todos/index.js)
```js
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
```

### 5. Map new route to main router
```js
import { Router } from 'express'

import todos from './todos'

const router = Router()

router.use('/todos', todos)

export default router
```

## Features included for all endpoints:
### GET /todos?skip=5&limit=20&sort=-createdAt&populate=user,commets.user&done=true
- *skip* & *limit* for easy pagination
- *sort* the result data on any filed, when defined with the prefix *-* ie.: -createdAt it will return the data in DESC
- *populate* any field of a model, multiple fields are supported with a comma separated list
- *X-Total-Count* is returned in the response header, with the total number of matching documents
- Any other arbitrary filed can be used to query the results just by listing them in the request url ie.: done=true

### POST /todos
- createdAt added to the model
- updatedAt added to the model

### DELETE /todos/:todoId
- soft deletes the document form the database by flipping *hidden* flag

## Deploy
For production build:
```bash
npm run build
```

Build a docker image of the app (make sure to change petergombos/api-template in package.json):
```bash
npm run build:docker
```

Run the image (change petergombos/api-template to your image name):
```bash
docker run -p 3000:3000 -e DB=MONGODB_HOST petergombos/api-template
```

Deploy image to DockerHub (test, build, docker image build, docker push)
```bash
npm run deploy
```

That's it, enjoy!

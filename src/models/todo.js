import APIModel from 'utils/APIModel'

const Todo = new APIModel('Todo', {
  title: String,
  done: Boolean
})

export default Todo.model

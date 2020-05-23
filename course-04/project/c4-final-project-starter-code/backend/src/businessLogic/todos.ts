import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import * as uuid from 'uuid'

const todoAccess = new TodosAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return todoAccess.getUserTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  }
  return await todoAccess.createTodo(newItem)
}

export async function updateToDo(todoId: string, updatedTodo: UpdateTodoRequest){

  return await todoAccess.updateTodo(updatedTodo, todoId)
}

export async function deleteToDo(todoId: string) {
  return await todoAccess.deleteTodoById(todoId)
}
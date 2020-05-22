import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import * as uuid from 'uuid'
import { parseUserId } from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  console.log("Processing Event:", event);

  const todoId = uuid.v4()
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createToDo(todoId, jwtToken, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}

async function createToDo(todoId: string, jwtToken: string, newTodo: CreateTodoRequest) {
  const newItem = {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    ...newTodo
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return newItem
}
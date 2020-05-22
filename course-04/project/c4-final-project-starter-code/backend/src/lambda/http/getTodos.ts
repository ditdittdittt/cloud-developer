import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import { parseUserId } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Get all TODO items for a current user
  console.log("Processing Event:", event);

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const userId = parseUserId(split[1])
  const items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

async function getTodos(userId: string){
  const result = await docClient.query({
    TableName : todosTable,
    IndexName: "UserIdIndex",
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },

    ScanIndexForward: false
  }).promise()

  return result.Items
}
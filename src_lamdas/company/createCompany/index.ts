import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { CompanyEntity, CompanyRequest } from './model';
import { allHaveValues } from 'src_lamdas/shared/compare';
import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = 'CompanyTable';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const companyRequest = body as CompanyRequest;

    if (!allHaveValues(companyRequest.name, companyRequest.cuit, companyRequest.address, companyRequest.phone, companyRequest.email, companyRequest.registrationDate)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const companyEntity = new CompanyEntity(companyRequest);

    await saveCompany(companyEntity);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Company successfully registered',
        companyId: companyEntity.id
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

async function saveCompany(companyEntity: CompanyEntity) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: companyEntity
  });

  await ddbDocClient.send(command);
}

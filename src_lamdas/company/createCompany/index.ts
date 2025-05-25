import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { CompanyEntity, CompanyRequest } from './model';
import { allHaveValues } from 'src_lamdas/shared/compare';
import { randomUUID } from 'node:crypto';

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

    saveMock(companyEntity)

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

/**
 * Función mock para guardar la compañia
 */
function saveMock(companyEntity: CompanyEntity) {
    companyEntity.id = randomUUID();
    console.log('Company saved:', companyEntity);
}

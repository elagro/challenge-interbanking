import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { CompanyRequest } from './model';
import { CompanyService } from '../service/company.service';
import { GenericResponse } from 'src_lamdas/shared/genericResponse';

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const companyRequest = new CompanyRequest(body);

    const isValidRequest = companyRequest.validate();
    if (!isValidRequest) {
      return GenericResponse.badRequest('Missing required fields');
    }

    const companyEntity = companyRequest.toEntity();

    const companyService = new CompanyService();
    const existCompany = await companyService.existCompany(companyEntity);

    if (existCompany) {
      return GenericResponse.badRequest('Company with this CUIT already exists');
    }

    await companyService.save(companyEntity);

    return GenericResponse.created(companyEntity, 'Company successfully registered');
    
  } catch (error) {
    return GenericResponse.error('Internal Server Error');
  }
};

import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { CompanyRequest } from './model';
import { CompanyService } from '../service/company.service';
import { GenericResponse } from 'src_lamdas/shared/genericResponse';

const companyService = new CompanyService();

export const handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const companyRequest = new CompanyRequest(JSON.parse(event.body || '{}'));

    const validationErrors = companyRequest.validate();
    if (validationErrors.length > 0) {
      return GenericResponse.badRequest(validationErrors.join(', '));
    }

    const companyEntity = companyRequest.toEntity();

    const companyExists = await companyService.companyExists(companyEntity.cuit);
    if (companyExists) {
      return GenericResponse.conflict('Company with this CUIT already exists');
    }

    const savedCompany = await companyService.save(companyEntity);

    return GenericResponse.created(savedCompany, 'Company successfully registered');
    
  } catch (error) {
    console.error(error);
    return GenericResponse.error('Internal Server Error');
  }
};

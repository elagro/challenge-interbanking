import { handler } from 'src_lamdas/company/createCompany/index';
import { CompanyRequest } from 'src_lamdas/company/createCompany/model';
import { CompanyService } from 'src_lamdas/company/service/company.service';
import { GenericResponse } from 'src_lamdas/shared/genericResponse';
import { APIGatewayEvent, Context } from 'aws-lambda';

// Mock the dependencies
jest.mock('src_lamdas/company/createCompany/model');
jest.mock('src_lamdas/company/service/company.service');

describe('createCompany Lambda Handler', () => {
  let mockEvent: APIGatewayEvent;
  let mockContext: Context;
  let mockCompanyRequestInstance: jest.Mocked<CompanyRequest>;
  let mockCompanyServiceInstance: jest.Mocked<CompanyService>;
  let consoleErrorSpy: jest.SpyInstance;

  const mockCompanyEntity = {
    id: '123',
    name: 'Test Company',
    cuit: '30-12345678-9',
    // other fields as necessary
  };

  beforeEach(() => {
    // Setup mock CompanyRequest instance and its methods
    mockCompanyRequestInstance = {
      validate: jest.fn(),
      toEntity: jest.fn().mockReturnValue(mockCompanyEntity),
    } as unknown as jest.Mocked<CompanyRequest>;
    (CompanyRequest as jest.Mock).mockImplementation(() => mockCompanyRequestInstance);

    // Setup mock CompanyService instance and its methods
    mockCompanyServiceInstance = {
      existCompany: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<CompanyService>;
    (CompanyService as jest.Mock).mockImplementation(() => mockCompanyServiceInstance);

    // Basic APIGatewayEvent mock
    mockEvent = {
      body: JSON.stringify({ name: 'Test Company', cuit: '30-12345678-9' }),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '/company',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any, // Simplified
      resource: '',
    };

    mockContext = {} as Context; // Context is not used in the handler

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error output during tests
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should create a company successfully', async () => {
    mockCompanyRequestInstance.validate.mockReturnValue(true);
    mockCompanyServiceInstance.existCompany.mockResolvedValue(false);
    mockCompanyServiceInstance.save.mockResolvedValue(undefined); // save returns void

    const response = await handler(mockEvent, mockContext);

    expect(CompanyRequest).toHaveBeenCalledWith(JSON.parse(mockEvent.body!));
    expect(mockCompanyRequestInstance.validate).toHaveBeenCalled();
    expect(mockCompanyRequestInstance.toEntity).toHaveBeenCalled();
    expect(CompanyService).toHaveBeenCalled();
    expect(mockCompanyServiceInstance.existCompany).toHaveBeenCalledWith(mockCompanyEntity);
    expect(mockCompanyServiceInstance.save).toHaveBeenCalledWith(mockCompanyEntity);
    expect(response).toEqual(GenericResponse.created(mockCompanyEntity, 'Company successfully registered'));
  });

  it('should return badRequest if company already exists', async () => {
    mockCompanyRequestInstance.validate.mockReturnValue(true);
    mockCompanyServiceInstance.existCompany.mockResolvedValue(true);

    const response = await handler(mockEvent, mockContext);

    expect(mockCompanyServiceInstance.existCompany).toHaveBeenCalledWith(mockCompanyEntity);
    expect(response).toEqual(GenericResponse.badRequest('Company with this CUIT already exists'));
    expect(mockCompanyServiceInstance.save).not.toHaveBeenCalled();
  });

  it('should return badRequest if input validation fails', async () => {
    mockCompanyRequestInstance.validate.mockReturnValue(false);

    const response = await handler(mockEvent, mockContext);

    expect(mockCompanyRequestInstance.validate).toHaveBeenCalled();
    expect(response).toEqual(GenericResponse.badRequest('Missing required fields'));
    expect(mockCompanyServiceInstance.existCompany).not.toHaveBeenCalled();
  });

  it('should return generic error if CompanyService.save throws an error', async () => {
    mockCompanyRequestInstance.validate.mockReturnValue(true);
    mockCompanyServiceInstance.existCompany.mockResolvedValue(false);
    const errorMessage = 'Database save error';
    mockCompanyServiceInstance.save.mockRejectedValue(new Error(errorMessage));

    const response = await handler(mockEvent, mockContext);

    expect(mockCompanyServiceInstance.save).toHaveBeenCalledWith(mockCompanyEntity);
    expect(response).toEqual(GenericResponse.error('Internal Server Error'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating company:', errorMessage);
  });

  it('should return generic error if CompanyService.existCompany throws an error', async () => {
    mockCompanyRequestInstance.validate.mockReturnValue(true);
    const errorMessage = 'Database existCompany error';
    mockCompanyServiceInstance.existCompany.mockRejectedValue(new Error(errorMessage));

    const response = await handler(mockEvent, mockContext);

    expect(mockCompanyServiceInstance.existCompany).toHaveBeenCalledWith(mockCompanyEntity);
    expect(response).toEqual(GenericResponse.error('Internal Server Error'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating company:', errorMessage);
  });

  it('should return generic error if JSON.parse throws an error for invalid body', async () => {
    mockEvent.body = 'invalid json';
    // No need to mock CompanyRequest or CompanyService as parsing happens before instantiation

    const response = await handler(mockEvent, mockContext);

    expect(response).toEqual(GenericResponse.error('Internal Server Error'));
    // The exact error message logged might depend on the JS environment's JSON.parse error
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error creating company:'), expect.any(String));
  });
});

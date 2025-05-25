import { GetCompaniesUseCases } from "src/modules/companies/application/usecases/getCompanies.usecases";
import { CompanyRepository } from "src/modules/companies/domain/company.repository";
import { CompanyEntityDto } from "src/modules/companies/domain/company.entity";

describe('GetCompaniesUseCases', () => {
    let getCompaniesUseCases: GetCompaniesUseCases;
    let companyRepository: jest.Mocked<CompanyRepository>;

    const mockCompanies: CompanyEntityDto[] = [
        {
            id: '1',
            name: 'Empresa Uno',
            cuit: '20-12345678-9',
            address: 'Calle Falsa 123',
            phone: '1234567890',
            email: 'uno@empresa.com',
            registrationDate: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            createdBy: 'Admin',
        },
        {
            id: '2',
            name: 'Empresa Dos',
            cuit: '23-98765432-1',
            address: 'Avenida Siempre Viva 742',
            phone: '0987654321',
            email: 'dos@empresa.com',
            registrationDate: new Date('2023-03-01'),
            createdAt: new Date('2023-03-01'),
            createdBy: 'Admin',
        },
    ];

    beforeEach(() => {
        companyRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByRegistrationDate: jest.fn(),
        };

        getCompaniesUseCases = new GetCompaniesUseCases(companyRepository);
    });

    it('debería retornar un array de empresas si existen', async () => {
        companyRepository.findAll.mockResolvedValue(mockCompanies);

        const result = await getCompaniesUseCases.execute();

        expect(result).toEqual(mockCompanies);
        expect(companyRepository.findAll).toHaveBeenCalled();
    });

    it('debería lanzar error si no hay empresas', async () => {
        companyRepository.findAll.mockResolvedValue(null);

        await expect(getCompaniesUseCases.execute()).rejects.toThrow('Companies not found');
        expect(companyRepository.findAll).toHaveBeenCalled();
    });
});

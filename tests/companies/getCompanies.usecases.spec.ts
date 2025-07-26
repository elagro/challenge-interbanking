import { GetCompaniesUseCases } from "src/modules/companies/application/usecases/getCompanies.usecases";
import { CompanyRepository } from "src/modules/companies/domain/company.repository";
import { Company } from "src/modules/companies/domain/company";

describe('GetCompaniesUseCases', () => {
    let getCompaniesUseCases: GetCompaniesUseCases;
    let companyRepository: jest.Mocked<CompanyRepository>;

    const mockCompanies: Company[] = [
        new Company(
            '1',
            'Empresa Uno',
            '20-12345678-9',
            'Calle Falsa 123',
            '1234567890',
            'uno@empresa.com',
            new Date('2022-01-01'),
        ),
        new Company(
            '2',
            'Empresa Dos',
            '23-98765432-1',
            'Avenida Siempre Viva 742',
            '0987654321',
            'dos@empresa.com',
            new Date('2023-03-01'),
        ),
    ];

    beforeEach(() => {
        companyRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByRegistrationDate: jest.fn(),
            findByCuit: jest.fn(),
            findByIds: jest.fn(),
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

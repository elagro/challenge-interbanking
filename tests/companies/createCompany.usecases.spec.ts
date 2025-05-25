import { CompanyEntityDto } from "src/modules/companies/domain/company.entity";
import { CompanyRepository } from "src/modules/companies/domain/company.repository";
import { CreateCompanyUseCases } from "src/modules/companies/application/usecases/createCompany.usecases";

describe('CreateCompanyUseCases', () => {
    let createCompanyUseCases: CreateCompanyUseCases;
    let mockCompanyRepository: jest.Mocked<CompanyRepository>;

    beforeEach(() => {
        mockCompanyRepository = {
            save: jest.fn(),
        } as unknown as jest.Mocked<CompanyRepository>;

        createCompanyUseCases = new CreateCompanyUseCases(mockCompanyRepository);
    });

    it('debería guardar una empresa y devolverla', async () => {
        const input: CompanyEntityDto = {
            createdAt: new Date("2020-05-25"),
            createdBy: "Jhon Doe",
            id: "1",
            name: "Doe Company",
            cuit: "20-12345678-9",
            address: "Av. Branch 159",
            phone: "123-456-7890",
            email: "info@ib.c0m",
            registrationDate: new Date("2020-05-25")
        };

        mockCompanyRepository.save.mockResolvedValue(input);

        const result = await createCompanyUseCases.execute(input);

        expect(result).toEqual(input);
        expect(mockCompanyRepository.save).toHaveBeenCalledWith(input);
    });
});

import { Company } from "src/modules/companies/domain/company";
import { CompanyRepository } from "src/modules/companies/domain/company.repository";
import { CreateCompanyUseCases } from "src/modules/companies/application/usecases/createCompany.usecases";
import { CompanyAlreadyExistsError } from "src/modules/companies/domain/errors/company-already-exists.error";

describe('CreateCompanyUseCases', () => {
    let createCompanyUseCases: CreateCompanyUseCases;
    let mockCompanyRepository: jest.Mocked<CompanyRepository>;

    beforeEach(() => {
        mockCompanyRepository = {
            save: jest.fn(),
            findByCuit: jest.fn(),
        } as unknown as jest.Mocked<CompanyRepository>;

        createCompanyUseCases = new CreateCompanyUseCases(mockCompanyRepository);
    });

    it('debería guardar una empresa y devolverla', async () => {
        const input = new Company(
            "1",
            "Doe Company",
            "20-12345678-9",
            "Av. Branch 159",
            "123-456-7890",
            "info@ib.c0m",
            new Date("2020-05-25")
        );

        mockCompanyRepository.findByCuit.mockResolvedValue(null);
        mockCompanyRepository.save.mockResolvedValue(input);

        const result = await createCompanyUseCases.execute(input);

        expect(result).toEqual(input);
        expect(mockCompanyRepository.save).toHaveBeenCalledWith(input);
    });

    it('debería lanzar un error si la empresa ya existe', async () => {
        const input = new Company(
            "1",
            "Doe Company",
            "20-12345678-9",
            "Av. Branch 159",
            "123-456-7890",
            "info@ib.c0m",
            new Date("2020-05-25")
        );

        mockCompanyRepository.findByCuit.mockResolvedValue(input);

        await expect(createCompanyUseCases.execute(input)).rejects.toThrow(CompanyAlreadyExistsError);
    });
});

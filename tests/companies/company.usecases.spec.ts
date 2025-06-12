import { CompanyUseCases } from "src/modules/companies/application/company.usecases";
import { CompanyEntityDto } from "src/modules/companies/domain/company.entity";
import { CompanyRepository } from "src/modules/companies/domain/company.repository";
import { TransferRepository } from "src/modules/transfers/domain/transfer.repository";
import { ObjectId } from "src/shared/types/types";

describe('CompanyUseCases', () => {
    let companyUseCases: CompanyUseCases;
    let mockCompanyRepository: jest.Mocked<CompanyRepository>;
    let mockTransferRepository: jest.Mocked<TransferRepository>;

    const mockCompany: CompanyEntityDto = {
        id: '1',
        name: 'Test Company',
        cuit: '30-12345678-9',
        address: 'Test Address 123',
        phone: '123456789',
        email: 'test@company.com',
        registrationDate: new Date('2023-01-15'),
        createdAt: new Date('2023-01-15'),
        createdBy: 'Admin',
    };

    const mockCompaniesList: CompanyEntityDto[] = [
        mockCompany,
        {
            id: '2',
            name: 'Another Company',
            cuit: '30-98765432-1',
            address: 'Another Address 456',
            phone: '987654321',
            email: 'another@company.com',
            registrationDate: new Date('2023-02-20'),
            createdAt: new Date('2023-02-20'),
            createdBy: 'Admin',
        },
    ];

    beforeEach(() => {
        mockCompanyRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByRegistrationDate: jest.fn(),
        } as unknown as jest.Mocked<CompanyRepository>; // Add all methods used

        mockTransferRepository = {
            findCompaniesWithTransfersInDateRange: jest.fn(),
            // Add other TransferRepository methods if they become needed by CompanyUseCases
        } as unknown as jest.Mocked<TransferRepository>;

        companyUseCases = new CompanyUseCases(mockCompanyRepository, mockTransferRepository);
    });

    describe('createCompany', () => {
        it('should save a company and return it', async () => {
            const input: CompanyEntityDto = { ...mockCompany };
            mockCompanyRepository.save.mockResolvedValue(input);

            const result = await companyUseCases.createCompany(input);

            expect(result).toEqual(input);
            expect(mockCompanyRepository.save).toHaveBeenCalledWith(input);
        });
    });

    describe('getCompanyById', () => {
        it('should return a company if found by id', async () => {
            const id = '1' as unknown as ObjectId; // Assuming ObjectId is a string or compatible
            mockCompanyRepository.findById.mockResolvedValue(mockCompany);

            const result = await companyUseCases.getCompanyById(id);

            expect(result).toEqual(mockCompany);
            expect(mockCompanyRepository.findById).toHaveBeenCalledWith(id);
        });

        it('should return null if company not found by id', async () => {
            const id = 'nonexistent' as unknown as ObjectId;
            mockCompanyRepository.findById.mockResolvedValue(null);

            const result = await companyUseCases.getCompanyById(id);

            expect(result).toBeNull();
            expect(mockCompanyRepository.findById).toHaveBeenCalledWith(id);
        });
    });

    describe('getAllCompanies', () => {
        it('should return an array of companies if they exist', async () => {
            mockCompanyRepository.findAll.mockResolvedValue(mockCompaniesList);

            const result = await companyUseCases.getAllCompanies();

            expect(result).toEqual(mockCompaniesList);
            expect(mockCompanyRepository.findAll).toHaveBeenCalled();
        });

        it('should throw an error if no companies are found (as per original use case)', async () => {
            // Based on the previous implementation of GetCompaniesUseCases
            mockCompanyRepository.findAll.mockResolvedValue(null as any); // Simulate repository returning null

            // Check if the consolidated use case maintains this behavior
            // The current implementation of companyUseCases.getAllCompanies throws 'Companies not found'
            await expect(companyUseCases.getAllCompanies()).rejects.toThrow('Companies not found');
            expect(mockCompanyRepository.findAll).toHaveBeenCalled();
        });
         it('should return an empty array if repository returns empty array', async () => {
            mockCompanyRepository.findAll.mockResolvedValue([]);
            const result = await companyUseCases.getAllCompanies();
            expect(result).toEqual([]);
            expect(mockCompanyRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('getCompaniesByRegistrationDate', () => {
        it('should return companies within the date range', async () => {
            const fromDate = new Date('2023-01-01');
            const toDate = new Date('2023-01-31');
            mockCompanyRepository.findByRegistrationDate.mockResolvedValue([mockCompany]);

            const result = await companyUseCases.getCompaniesByRegistrationDate(fromDate, toDate);

            expect(result).toEqual([mockCompany]);
            expect(mockCompanyRepository.findByRegistrationDate).toHaveBeenCalledWith(fromDate, toDate);
        });

        it('should throw an error if no companies are found in date range (as per original use case)', async () => {
            const fromDate = new Date('2024-01-01');
            const toDate = new Date('2024-01-31');
            mockCompanyRepository.findByRegistrationDate.mockResolvedValue(null as any); // Simulate null return

            await expect(companyUseCases.getCompaniesByRegistrationDate(fromDate, toDate))
                .rejects.toThrow('Companies not found for the given date range');
            expect(mockCompanyRepository.findByRegistrationDate).toHaveBeenCalledWith(fromDate, toDate);
        });

        it('should return an empty array if repository returns empty array for date range', async () => {
            const fromDate = new Date('2023-01-01');
            const toDate = new Date('2023-01-31');
            mockCompanyRepository.findByRegistrationDate.mockResolvedValue([]);
            const result = await companyUseCases.getCompaniesByRegistrationDate(fromDate, toDate);
            expect(result).toEqual([]);
            expect(mockCompanyRepository.findByRegistrationDate).toHaveBeenCalledWith(fromDate, toDate);
        });
    });

    describe('getCompaniesWithTransfersByEffectiveDate', () => {
        it('should return companies with transfers within the effective date range', async () => {
            const fromDate = new Date('2023-03-01');
            const toDate = new Date('2023-03-31');
            // This method in CompanyUseCases calls transferRepository
            mockTransferRepository.findCompaniesWithTransfersInDateRange.mockResolvedValue(mockCompaniesList);

            const result = await companyUseCases.getCompaniesWithTransfersByEffectiveDate(fromDate, toDate);

            expect(result).toEqual(mockCompaniesList);
            expect(mockTransferRepository.findCompaniesWithTransfersInDateRange).toHaveBeenCalledWith(fromDate, toDate);
        });

        it('should return an empty array if no companies with transfers are found', async () => {
            const fromDate = new Date('2024-01-01');
            const toDate = new Date('2024-01-31');
            // The original use case returned [] if !companiesWithTransfer or length === 0
            // The consolidated CompanyUseCases returns [] if !companiesWithTransfer
            mockTransferRepository.findCompaniesWithTransfersInDateRange.mockResolvedValue(null as any);

            let result = await companyUseCases.getCompaniesWithTransfersByEffectiveDate(fromDate, toDate);
            expect(result).toEqual([]);

            mockTransferRepository.findCompaniesWithTransfersInDateRange.mockResolvedValue([]);
            result = await companyUseCases.getCompaniesWithTransfersByEffectiveDate(fromDate, toDate);
            expect(result).toEqual([]);
            expect(mockTransferRepository.findCompaniesWithTransfersInDateRange).toHaveBeenCalledWith(fromDate, toDate);
        });
    });
});

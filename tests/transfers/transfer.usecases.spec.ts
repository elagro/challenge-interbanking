import { TransferUseCases } from "src/modules/transfers/application/transfer.usecases";
import { TransferEntityDto } from "src/modules/transfers/domain/transfer.entity";
import { TransferRepository } from "src/modules/transfers/domain/transfer.repository";

describe('TransferUseCases', () => {
    let transferUseCases: TransferUseCases;
    let mockTransferRepository: jest.Mocked<TransferRepository>;

    const mockTransfer: TransferEntityDto = {
        id: "1f4981ce-e36d-461b-a1c7-885a5545b903",
        companyIdFrom: "5560e1ea-bbfe-4c2b-8e66-799ae3973b63",
        accountIdFrom: "ACC-001-2024-0001",
        amount: 15000.5,
        currency: "USD",
        companyIdTo: "550e8400-e29b-41d4-a716-446655440002",
        accountIdTo: "ACC-002-2024-0005",
        concept: "Payment for services rendered",
        reference: "INV-2024-001234",
        controlNumber: "TXN-240522-001",
        effectiveDate: new Date("2025-05-22T14:30:00.000Z"),
        createdAt: new Date("2025-05-25T02:45:07.557Z"),
        createdBy: "TestUser",
    };

    const mockTransfersList: TransferEntityDto[] = [
        mockTransfer,
        {
            id: "89ae1a6d-9d03-42a0-97f4-2e1b9b889d6a",
            companyIdFrom: "1",
            accountIdFrom: "ARG-001-2024-0001",
            amount: 565.5,
            currency: "ARS",
            companyIdTo: "2",
            accountIdTo: "ARG-002-2024-0005",
            concept: "Pago de servcios",
            reference: "2025-321654",
            controlNumber: "557522-001",
            effectiveDate: new Date("2025-05-23T10:00:00.000Z"),
            createdAt: new Date("2025-05-25T08:27:03.056Z"),
            createdBy: "TestUser",
        },
    ];

    beforeEach(() => {
        mockTransferRepository = {
            save: jest.fn(),
            findById: jest.fn(), // Though not directly tested here, good to have for completeness if use case expands
            findAll: jest.fn(),
            findByEffectiveDate: jest.fn(),
            findCompaniesWithTransfersInDateRange: jest.fn(), // Also not directly for these tests, but part of interface
        } as unknown as jest.Mocked<TransferRepository>;

        transferUseCases = new TransferUseCases(mockTransferRepository);
    });

    describe('createTransfer', () => {
        it('should save a transfer and return it', async () => {
            const inputDto: TransferEntityDto = { ...mockTransfer };
            mockTransferRepository.save.mockResolvedValue(inputDto);

            const result = await transferUseCases.createTransfer(inputDto);

            expect(result).toEqual(inputDto);
            expect(mockTransferRepository.save).toHaveBeenCalledWith(inputDto);
        });
    });

    describe('getAllTransfers', () => {
        it('should return a list of transfers if they exist', async () => {
            mockTransferRepository.findAll.mockResolvedValue(mockTransfersList);

            const result = await transferUseCases.getAllTransfers();

            expect(result).toEqual(mockTransfersList);
            expect(mockTransferRepository.findAll).toHaveBeenCalled();
        });

        it('should return null if no transfers exist (as per original GetTransfersUseCases)', async () => {
            mockTransferRepository.findAll.mockResolvedValue(null);

            const result = await transferUseCases.getAllTransfers();

            expect(result).toBeNull();
            expect(mockTransferRepository.findAll).toHaveBeenCalled();
        });

        it('should return an empty array if repository returns an empty array', async () => {
            mockTransferRepository.findAll.mockResolvedValue([]);
            const result = await transferUseCases.getAllTransfers();
            expect(result).toEqual([]);
            expect(mockTransferRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('getTransfersByEffectiveDate', () => {
        it('should return transfers within the date range', async () => {
            const fromDate = new Date('2025-05-01');
            const toDate = new Date('2025-05-31');
            mockTransferRepository.findByEffectiveDate.mockResolvedValue([mockTransfer]);

            const result = await transferUseCases.getTransfersByEffectiveDate(fromDate, toDate);

            expect(result).toEqual([mockTransfer]);
            expect(mockTransferRepository.findByEffectiveDate).toHaveBeenCalledWith(fromDate, toDate);
        });

        it('should throw an error if no transfers are found in date range (as per original use case)', async () => {
            const fromDate = new Date('2024-01-01');
            const toDate = new Date('2024-01-31');
            // The original GetTransfersByEffectiveDateUseCases threw an error if !transfers.
            // The consolidated TransferUseCases.getTransfersByEffectiveDate also throws 'transfers not found'.
            mockTransferRepository.findByEffectiveDate.mockResolvedValue(null as any);

            await expect(transferUseCases.getTransfersByEffectiveDate(fromDate, toDate))
                .rejects.toThrow('transfers not found');
            expect(mockTransferRepository.findByEffectiveDate).toHaveBeenCalledWith(fromDate, toDate);
        });

        it('should return an empty array if repository returns an empty array for date range', async () => {
            const fromDate = new Date('2025-05-01');
            const toDate = new Date('2025-05-31');
            mockTransferRepository.findByEffectiveDate.mockResolvedValue([]);
            const result = await transferUseCases.getTransfersByEffectiveDate(fromDate, toDate);
            expect(result).toEqual([]);
            expect(mockTransferRepository.findByEffectiveDate).toHaveBeenCalledWith(fromDate, toDate);
        });
    });
});

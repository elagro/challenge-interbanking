import { GetTransfersUseCases } from 'src/modules/transfers/application/usecases/getTransfers.usecases';
import { TransferRepository } from 'src/modules/transfers/domain/transfer.repository';
import { TransferEntityDto } from 'src/modules/transfers/domain/transfer.entity';

describe('GetTransfersUseCases', () => {
    let getTransfersUseCases: GetTransfersUseCases;
    let transferRepository: jest.Mocked<TransferRepository>;

    beforeEach(() => {
        //Mockeamos el repositorio con Jest
        transferRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByEffectiveDate: jest.fn(),
        };


        //Instanciamos el caso de uso con el mock
        getTransfersUseCases = new GetTransfersUseCases(transferRepository);
    });

    it('debería devolver una lista de transferencias', async () => {
        //Transferencias simuladas
        const transfers: TransferEntityDto[] = [
            {
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
                createdBy: "Myself",
            },
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
                createdBy: "Myself",
            },
        ];

        //Configuramos el mock para devolverlas
        transferRepository.findAll.mockResolvedValue(transfers);

        //Ejecutamos el caso de uso
        const result = await getTransfersUseCases.execute();

        //Verificamos que se devuelve el array correctamente
        expect(result).toEqual(transfers);
        expect(transferRepository.findAll).toHaveBeenCalled();
    });

    it('debería devolver null si no hay transferencias', async () => {
        //Configuramos el mock para devolver null
        transferRepository.findAll.mockResolvedValue(null);

        const result = await getTransfersUseCases.execute();

        //Verificamos que se devuelve null
        expect(result).toBeNull();
        expect(transferRepository.findAll).toHaveBeenCalled();
    });
});

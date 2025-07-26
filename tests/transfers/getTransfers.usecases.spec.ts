import { GetTransfersUseCases } from 'src/modules/transfers/application/usecases/getTransfers.usecases';
import { TransferRepository } from 'src/modules/transfers/domain/transfer.repository';
import { Transfer } from 'src/modules/transfers/domain/transfer';
import { ObjectId } from 'src/shared/types/types';

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
            findUniqueCompaniesByEffectiveDate: jest.fn(),
            findCompaniesWithTransfersInDateRange: jest.fn(),
        };


        //Instanciamos el caso de uso con el mock
        getTransfersUseCases = new GetTransfersUseCases(transferRepository);
    });

    it('debería devolver una lista de transferencias', async () => {
        //Transferencias simuladas
        const transfers: Transfer[] = [
            new Transfer(
                "1f4981ce-e36d-461b-a1c7-885a5545b903",
                new ObjectId("60d21b4667d0d8992e610c85"),
                "ACC-001-2024-0001",
                15000.5,
                "USD",
                "550e8400-e29b-41d4-a716-446655440002",
                "ACC-002-2024-0005",
                "Payment for services rendered",
                "INV-2024-001234",
                "TXN-240522-001",
                new Date("2025-05-22T14:30:00.000Z"),
            ),
            new Transfer(
                "89ae1a6d-9d03-42a0-97f4-2e1b9b889d6a",
                new ObjectId("60d21b4667d0d8992e610c85"),
                "ARG-001-2024-0001",
                565.5,
                "ARS",
                "2",
                "ARG-002-2024-0005",
                "Pago de servcios",
                "2025-321654",
                "557522-001",
                new Date("2025-05-23T10:00:00.000Z"),
            ),
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

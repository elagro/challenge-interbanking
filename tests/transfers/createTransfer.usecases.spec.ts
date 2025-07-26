import { CreateTransferUseCases } from 'src/modules/transfers/application/usecases/createTransfer.usecases';
import { TransferRepository } from 'src/modules/transfers/domain/transfer.repository';
import { Transfer } from 'src/modules/transfers/domain/transfer';
import { ObjectId } from 'src/shared/types/types';

describe('CreateTransferUseCases', () => {
    let createTransferUseCases: CreateTransferUseCases;
    let transferRepository: jest.Mocked<TransferRepository>;

    beforeEach(() => {
        transferRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByEffectiveDate: jest.fn(),
            findUniqueCompaniesByEffectiveDate: jest.fn(),
            findCompaniesWithTransfersInDateRange: jest.fn(),
        };

        //Instanciamos el caso de uso con el mock inyectado
        createTransferUseCases = new CreateTransferUseCases(transferRepository);
    });

    it('debería guardar una transferencia y devolverla', async () => {
        const transfer = new Transfer(
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
        );

        //Configuramos el mock para que devuelva esa transferencia
        transferRepository.save.mockResolvedValue(transfer);

        //Ejecutamos el caso de uso
        const result = await createTransferUseCases.execute(transfer);

        //Verificamos que devolvió lo esperado
        expect(result).toEqual(transfer);

        //Verificamos que se llamó al método `save` con el DTO correcto
        expect(transferRepository.save).toHaveBeenCalledWith(transfer);
    });
});

import { CreateTransferUseCases } from 'src/modules/transfers/application/usecases/createTransfer.usecases';
import { TransferRepository } from 'src/modules/transfers/domain/transfer.repository';
import { TransferEntityDto } from 'src/modules/transfers/domain/transfer.entity';

describe('CreateTransferUseCases', () => {
    let createTransferUseCases: CreateTransferUseCases;
    let transferRepository: jest.Mocked<TransferRepository>;

    beforeEach(() => {
        transferRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByEffectiveDate: jest.fn(),
        };

        //Instanciamos el caso de uso con el mock inyectado
        createTransferUseCases = new CreateTransferUseCases(transferRepository);
    });

    it('debería guardar una transferencia y devolverla', async () => {
        const transferDto: TransferEntityDto = {
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
        };

        //Configuramos el mock para que devuelva esa transferencia
        transferRepository.save.mockResolvedValue(transferDto);

        //Ejecutamos el caso de uso
        const result = await createTransferUseCases.execute(transferDto);

        //Verificamos que devolvió lo esperado
        expect(result).toEqual(transferDto);

        //Verificamos que se llamó al método `save` con el DTO correcto
        expect(transferRepository.save).toHaveBeenCalledWith(transferDto);
    });
});

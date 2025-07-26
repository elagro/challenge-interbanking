import { ObjectId } from "src/shared/types/types";

export class Transfer {
  constructor(
    public readonly id: string | undefined,
    public readonly companyIdFrom: ObjectId,
    public readonly accountIdFrom: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly companyIdTo: string,
    public readonly accountIdTo: string,
    public readonly concept: string,
    public readonly reference: string,
    public readonly controlNumber: string,
    public readonly effectiveDate: Date,
  ) {}
}

export class Company {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly cuit: string,
    public readonly address: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly registrationDate: Date,
  ) {}
}

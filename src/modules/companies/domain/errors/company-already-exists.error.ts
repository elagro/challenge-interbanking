export class CompanyAlreadyExistsError extends Error {
  constructor(cuit: string) {
    super(`Company with CUIT ${cuit} already exists`);
    this.name = "CompanyAlreadyExistsError";
  }
}

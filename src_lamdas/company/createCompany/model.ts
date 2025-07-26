import { IsString, IsEmail, IsDate, validateSync } from 'class-validator';

export class CompanyEntity {
  id?: string;
  name: string;
  cuit: string;
  address: string;
  phone: string;
  email: string;
  registrationDate: Date;
}

export class CompanyRequest {
  @IsString()
  name: string;

  @IsString()
  cuit: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsDate()
  registrationDate: Date;

  constructor(request: Partial<CompanyRequest>) {
    this.name = request.name;
    this.cuit = request.cuit;
    this.address = request.address;
    this.phone = request.phone;
    this.email = request.email;
    this.registrationDate = new Date(request.registrationDate);
  }

  toEntity(): CompanyEntity {
    const companyEntity = new CompanyEntity();
    companyEntity.name = this.name;
    companyEntity.cuit = this.cuit;
    companyEntity.address = this.address;
    companyEntity.phone = this.phone;
    companyEntity.email = this.email;
    companyEntity.registrationDate = this.registrationDate;
    return companyEntity;
  }

  validate(): string[] {
    const errors = validateSync(this);
    if (errors.length > 0) {
      return errors.map(err => Object.values(err.constraints)).flat();
    }
    return [];
  }
}
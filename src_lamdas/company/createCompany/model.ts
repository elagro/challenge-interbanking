import { allHaveValues } from "src_lamdas/shared/compare";

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
  name: string;
  cuit: string;
  address: string;
  phone: string;
  email: string;
  registrationDate: Date;

  constructor(request: CompanyRequest) {
    this.name = request.name;
    this.cuit = request.cuit;
    this.address = request.address;
    this.phone = request.phone;
    this.email = request.email;
    this.registrationDate = request.registrationDate;
  }

  toEntity(): CompanyEntity {
    const companyEntity = new CompanyEntity();
    companyEntity.name = this.name;
    companyEntity.cuit = this.cuit;
    companyEntity.address = this.address;
    companyEntity.phone = this.phone;
    companyEntity.email = this.email;
    companyEntity.registrationDate = new Date(this.registrationDate);

    return companyEntity;
  }

  validate() {
    return allHaveValues(this.name, this.cuit, this.address, this.phone, this.email, this.registrationDate)
  }
}
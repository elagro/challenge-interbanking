export interface CompanyRequest {
  name: string;
  cuit: string;
  address: string;    
  phone: string;
  email: string;
  registrationDate: Date;
}

export class CompanyEntity {
    id?: string;
    name: string;
    cuit: string;
    address: string;
    phone: string;
    email: string;
    registrationDate: Date;

    constructor (companyRequest: CompanyRequest) {
        this.name = companyRequest.name;
        this.cuit = companyRequest.cuit;
        this.address = companyRequest.address;
        this.phone = companyRequest.phone;
        this.email = companyRequest.email;
        this.registrationDate = new Date(companyRequest.registrationDate);
    }
}
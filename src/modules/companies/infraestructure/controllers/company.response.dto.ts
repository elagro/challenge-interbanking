import { Expose } from "class-transformer";
import { Company } from "../../domain/company";

export class CompanyResponseDto {
  @Expose()
  id?: string;

  @Expose()
  name: string;

  @Expose({ name: 'tax_id' })
  cuit: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  registrationDate: Date;

  static toResponseDto(company: Company | null): CompanyResponseDto {
    const companyResponse = new CompanyResponseDto();

    if (!company) {
      return companyResponse;
    }

    companyResponse.id = company.id;
    companyResponse.name = company.name;
    companyResponse.cuit = company.cuit;
    companyResponse.address = company.address;
    companyResponse.phone = company.phone;
    companyResponse.email = company.email;
    companyResponse.registrationDate = company.registrationDate;

    return companyResponse;
  }

  static toResponseDtos(companies: Company[] | null): CompanyResponseDto[] {
    if (!companies || companies.length === 0) {
      return [];
    }
    const companyResponseDtos = companies.map((x) => CompanyResponseDto.toResponseDto(x));

    return companyResponseDtos;
  }
}
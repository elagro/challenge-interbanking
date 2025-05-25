import { Expose } from "class-transformer";
import { CompanyEntityDto } from "../../domain/company.entity";

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

  static toResponseDto(companyDto: CompanyEntityDto | null): CompanyResponseDto {
    const company = new CompanyResponseDto();

    if (!companyDto) {
      return company;
    }


    company.id = companyDto.id;
    company.name = companyDto.name;
    company.cuit = companyDto.cuit;
    company.address = companyDto.address;
    company.phone = companyDto.phone;
    company.email = companyDto.email;
    company.registrationDate = companyDto.registrationDate;

    return company;
  }

  static toResponseDtos(companyDtos: CompanyEntityDto[] | null): CompanyResponseDto[] {
    if (!companyDtos || companyDtos.length === 0) {
      return [];
    }
    const companyResponseDtos = companyDtos.map((x) => CompanyResponseDto.toResponseDto(x));

    return companyResponseDtos;
  }
}
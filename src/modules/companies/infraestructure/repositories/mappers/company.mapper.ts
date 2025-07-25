import { Company } from "src/modules/companies/domain/company";
import { CompanyEntityDto } from "../dtos/company.dto";

export class CompanyMapper {
  static toDomain(companyDto: CompanyEntityDto): Company {
    return new Company(
      companyDto.id,
      companyDto.name,
      companyDto.cuit,
      companyDto.address,
      companyDto.phone,
      companyDto.email,
      companyDto.registrationDate,
    );
  }

  static toPersistence(company: Company): CompanyEntityDto {
    const companyDto = new CompanyEntityDto();
    companyDto.id = company.id;
    companyDto.name = company.name;
    companyDto.cuit = company.cuit;
    companyDto.address = company.address;
    companyDto.phone = company.phone;
    companyDto.email = company.email;
    companyDto.registrationDate = company.registrationDate;
    return companyDto;
  }
}

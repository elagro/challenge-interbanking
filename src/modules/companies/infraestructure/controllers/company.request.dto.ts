import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Company } from "../../domain/company";

export class CompanyRequestDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;
    
  @Expose({ name: 'taxId' })
  @Transform(({ obj }) => obj.taxId || obj.cuit) // Transforma taxId a cuit
  @IsString()
  @IsNotEmpty()
  cuit: string;
    
  @IsString()
  @IsNotEmpty()
  address: string;
    
  @IsString()
  @IsNotEmpty()
  phone: string;
    
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  registrationDate: Date;

  toCompany(): Company {
    return new Company(
      undefined,
      this.name,
      this.cuit,
      this.address,
      this.phone,
      this.email,
      this.registrationDate
    );
  }
}
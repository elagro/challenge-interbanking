import { Expose, Transform, Type } from "class-transformer";
import { CompanyEntityDto } from "../../domain/company.entity";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CompanyRequestDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;
    
  @Expose({ name: 'tax_id' })
  @Transform(({ obj }) => obj.tax_id || obj.cuit) // Transforma tax_id a cuit
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

  toCompanyDto(): CompanyEntityDto {
    return {
      name: this.name,
      cuit: this.cuit,
      address: this.address,
      phone: this.phone,
      email: this.email,
      registrationDate: this.registrationDate,
    };
  }
}
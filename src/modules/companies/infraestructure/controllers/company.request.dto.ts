import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Company } from "../../domain/company";

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

  toCompany(): Company {
    return new Company(
      null,
      this.name,
      this.cuit,
      this.address,
      this.phone,
      this.email,
      this.registrationDate
    );
  }
}
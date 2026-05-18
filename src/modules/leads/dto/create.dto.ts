import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, MaxLength, MinLength, IsPositive } from 'class-validator';
import { FuenteLead } from '../../../models/Lead';

export class CreateLeadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nombre: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsEnum(FuenteLead)
  fuente: FuenteLead;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  productoInteres?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  presupuesto?: number;
}
import { IsString, IsOptional, IsEnum, IsNumber, IsPositive, MaxLength, IsEmail } from 'class-validator';
import { FuenteLead } from '../../../models/Lead';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsEnum(FuenteLead)
  fuente?: FuenteLead;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  productoInteres?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  presupuesto?: number;
}
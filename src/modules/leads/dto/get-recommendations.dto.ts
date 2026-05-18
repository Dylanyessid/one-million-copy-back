import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetRecommendationsDto {
  @IsOptional()
  @IsString()
  fuente?: string;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
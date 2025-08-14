import { IsString, IsDateString, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FiltersDto {
  @IsOptional()
  page: number = 1; 

  @IsOptional()
  limit: number = 10; 

  @IsOptional()
  @IsString()
  examTypeID?: string; 

  @IsOptional()
  @IsDateString()
  startDate?: string; 

  @IsOptional()
  @IsDateString()
  endDate?: string; 

  @IsOptional()
  @IsString()
  examStatus?: string; 

  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  collaborators?: string[];
}

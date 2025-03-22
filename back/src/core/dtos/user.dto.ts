import { IsString, IsNotEmpty, IsEmail, IsDate, IsUUID, IsUrl, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  riotId: string;

  @IsNotEmpty()
  @IsUUID()
  roleId?: string;

}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  familyIds?: string[];
}
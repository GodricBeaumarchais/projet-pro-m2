import { IsString, IsNotEmpty, IsEmail, IsDate, IsUUID, IsUrl, IsArray, IsOptional, Matches } from 'class-validator';
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
  @Matches(/^[a-zA-Z0-9-]{3,16}#[A-Z]{3,4}$/, {
    message: 'Le riotId doit être au format username#TAG'
  })
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
  @IsString()
  riotId?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  familyIds?: string[];
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty} from 'class-validator';
export class CreateRoleDto {

  @ApiProperty({ description: 'Le titre du rôle', example: 'Administrateur' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ description: 'La description du rôle', example: 'Responsable de la gestion des utilisateurs et des permissions' })
  @IsString()
  @IsNotEmpty()
  description: string;


}

export class UpdateRoleDto {
  @ApiProperty({ description: 'Le titre du rôle', example: 'Modérateur', required: false })
  @IsString()
  @IsNotEmpty()
  titre?: string;

  @ApiProperty({ description: 'La description du rôle', example: 'Responsable de la modération des contenus', required: false })
  @IsString()
  @IsNotEmpty()
  description?: string;


}

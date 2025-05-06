import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleUseCases } from '../use-cases/role/role.use-case';
import { CreateRoleDto, UpdateRoleDto } from 'src/core/dtos/role.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/use-cases/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/use-cases/auth/guard/roles.guard';

@ApiTags('role')
@Controller('api/role')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RoleController {
    constructor(private roleUseCases: RoleUseCases) { }

    // Routes avec rôle 'admin'
    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Récupère tous les rôles' })
    async getAll() {
        return this.roleUseCases.getAllRoles();
    }

    @Get(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Récupère un rôle par son ID' })
    async getRoleById(@Param('id') id: string) {
        return this.roleUseCases.getRoleById(id);
    }

    // Routes avec rôle 'superAdmin'
    @Post()
    @Roles('superAdmin')
    @ApiOperation({ summary: 'Crée un nouveau rôle' })
    async postRole(@Body() role: CreateRoleDto) {
        return this.roleUseCases.createRole(role);
    }

    @Put(':id')
    @Roles('superAdmin')
    @ApiOperation({ summary: 'Met à jour un rôle existant' })
    async putRole(@Param('id') id: string, @Body() role: UpdateRoleDto) {
        return this.roleUseCases.updateRole(id, role);
    }

    @Delete(':id')
    @Roles('superAdmin')
    @ApiOperation({ summary: 'Supprime un rôle' })
    async deleteRole(@Param('id') id: string) {
        return this.roleUseCases.deleteRole(id);
    }
}

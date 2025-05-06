import { Injectable } from '@nestjs/common';
import { Role } from '../../core/entities';
import { IDataServices } from '../../core';
import { CreateRoleDto, UpdateRoleDto } from '../../core/dtos';
import { RoleFactoryService } from './role-factory.service';

@Injectable()
export class RoleUseCases {
    constructor(
        private dataServices: IDataServices,
        private roleFactoryService: RoleFactoryService,
    ) { }

    getAllRoles(): Promise<Role[]> {
        return this.dataServices.roles.getAll();
    }

    getRoleById(id: any): Promise<Role> {
        return this.dataServices.roles.get(id);
    }

    createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const role = this.roleFactoryService.createNewRole(createRoleDto);
        return this.dataServices.roles.create(role);
    }

    updateRole(
        roleId: string,
        updateRoleDto: UpdateRoleDto,
    ): Promise<Role> {
        const role = this.roleFactoryService.updateRole(updateRoleDto);
        return this.dataServices.roles.update(roleId, role);
    }

    deleteRole(roleId: string): Promise<Role> {
        return this.dataServices.roles.delete(roleId);
    }
}

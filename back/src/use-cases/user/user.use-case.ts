import { Injectable } from '@nestjs/common';
import { User, UserSafe } from '../../core/entities';
import { CreateUserDto, UpdateUserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';
import { UserService } from '../../orm/prisma/services/user.service';
import { IDataServices } from 'src/core';

@Injectable()
export class UserUseCases {
    constructor(
        private dataServices: IDataServices,
        private userFactoryService: UserFactoryService,
    ) {}

    getAllUsers(): Promise<User[]> {
        return this.dataServices.users.getAll();
    }

    getUserById(id: string): Promise<User | null> {
        return this.dataServices.users.get(id);
    }

    getUserSafeById(id: string): Promise<UserSafe | null> {
        return this.dataServices.users.getUserSafe(id);
    }

    createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userFactoryService.createNewUser(createUserDto);
        return this.dataServices.users.create(user);
    }

    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = this.userFactoryService.updateUser(updateUserDto);
        return this.dataServices.users.update(userId, user as User);
    }

    deleteUser(userId: string): Promise<User> {
        return this.dataServices.users.delete(userId);
    }

    getUsersByRoleName(role: string): Promise<User[]> {
        return this.dataServices.users.getByRoleName(role);
    }

    findOneByEmail(email: string): Promise<Partial<User>> {
        return this.dataServices.users.getByEmail(email);
    }

    getSelf(userId: string): Promise<Partial<User>> {
        return this.dataServices.users.getSelf(userId);
    }

    getOtherUsers(userId: string): Promise<Partial<User>[]> {
        return this.dataServices.users.getOtherUsers(userId);
    }

    async searchUsersByEmail(searchTerm: string): Promise<UserSafe[]> {
        return this.dataServices.users.searchUsersByEmail(searchTerm);
    }

}
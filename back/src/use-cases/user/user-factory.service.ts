import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { CreateUserDto, UpdateUserDto } from '../../core/dtos';

@Injectable()
export class UserFactoryService {
    createNewUser(createUserDto: CreateUserDto): User {
        const newUser = new User();
        newUser.email = createUserDto.email;
        newUser.firstName = createUserDto.firstName;
        newUser.lastName = createUserDto.lastName;
        newUser.riotId = createUserDto.riotId;
        newUser.roleId = createUserDto.roleId;

        return newUser;
    }

    updateUser(updateUserDto: UpdateUserDto): Partial<User> {
        const updatedUser: Partial<User> = {};
        if (updateUserDto.email) updatedUser.email = updateUserDto.email;
        if (updateUserDto.firstName) updatedUser.firstName = updateUserDto.firstName;
        if (updateUserDto.lastName) updatedUser.lastName = updateUserDto.lastName;
        if (updateUserDto.riotId) updatedUser.riotId = updateUserDto.riotId;
        if (updateUserDto.roleId) updatedUser.roleId = updateUserDto.roleId;

        return updatedUser;
    }
}
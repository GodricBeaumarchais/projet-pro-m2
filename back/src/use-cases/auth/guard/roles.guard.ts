import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserUseCases } from 'src/use-cases/user/user.use-case';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private usersService: UserUseCases,
        private configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1];
        const decoded = this.jwtService.decode(token) as any;

        const user = await this.usersService.getUserById(decoded.sub);

        const ROLE_PRIORITIES = {
            [this.configService.get<string>('DEFAULT_ROLE_ID')]: 1,
            [this.configService.get<string>('ADMIN_ROLE_ID')]: 2,
            [this.configService.get<string>('SUPER_ADMIN_ROLE_ID')]: 3,
        };

        roles.forEach(role => {
            const transformedRole = role.replace('superAdmin', 'super_admin');
        });

        const hasRole = roles.some(role => {
            const transformedRole = role.replace('superAdmin', 'super_admin');
            console.log(transformedRole);
            console.log(ROLE_PRIORITIES[this.configService.get<string>(`${transformedRole.toUpperCase()}_ROLE_ID`)])
            console.log(ROLE_PRIORITIES[user.roleId])
            return ROLE_PRIORITIES[user.roleId] >= ROLE_PRIORITIES[this.configService.get<string>(`${transformedRole.toUpperCase()}_ROLE_ID`)];
        });

        if (!hasRole) {
            throw new ForbiddenException('You do not have the required role to access this resource');
        }

        return true;
    }
}

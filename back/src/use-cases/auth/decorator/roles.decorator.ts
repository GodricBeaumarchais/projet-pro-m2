import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('default' | 'admin' | 'superAdmin')[]) => {
    return SetMetadata('roles', roles);
};
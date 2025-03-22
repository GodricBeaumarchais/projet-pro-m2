// src/auth/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const getUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUser => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        
        return {
            userId: user.sub,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
    },
);

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guard/roles.guard';
import { UserUseCases } from '../user/user.use-case';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true })
    ],
    providers: [AuthService, JwtStrategy, RolesGuard, UserUseCases, ConfigService],
    exports: [AuthService, RolesGuard, JwtModule],
})
export class AuthModule { }



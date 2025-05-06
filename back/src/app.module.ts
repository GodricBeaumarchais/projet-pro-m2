import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './use-cases/auth/auth.module';
import { UserModule } from './use-cases/user/user.module';
import { RoleModule } from './use-cases/role/role.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaDataServicesModule } from './orm/prisma/prisma-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaDataServicesModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}

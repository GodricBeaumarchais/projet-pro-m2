import { Module } from '@nestjs/common';
import { UserFactoryService } from './user-factory.service';
import { UserUseCases } from './user.use-case';
import { PrismaDataServicesModule } from 'src/orm/prisma/prisma-module.module';

@Module({
  imports: [PrismaDataServicesModule],
  providers: [UserFactoryService, UserUseCases],
  exports: [UserFactoryService, UserUseCases],
})
export class UserModule {}

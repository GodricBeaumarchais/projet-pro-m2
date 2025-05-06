import { Module } from '@nestjs/common';
import { RoleFactoryService } from './role-factory.service';
import { RoleUseCases } from './role.use-case';
import { PrismaDataServicesModule } from 'src/orm/prisma/prisma-module.module';

@Module({
  imports: [PrismaDataServicesModule],
  providers: [RoleFactoryService, RoleUseCases],
  exports: [RoleFactoryService, RoleUseCases],
})
export class RoleModule {}

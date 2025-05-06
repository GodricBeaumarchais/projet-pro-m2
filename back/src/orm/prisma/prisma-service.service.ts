import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated';
import { IDataServices } from '../../core';
import { PrismaGenericRepository } from './generique-repo';
import { Role } from "../../core/entities";
import { AbsUserService } from 'src/core/abstract/service/user-service.abstract';
import { UserService } from './services/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaDataServices implements IDataServices, OnModuleInit, OnModuleDestroy {
    private prismaClient: PrismaClient;

    users: AbsUserService;
    roles: PrismaGenericRepository<Role>;

    constructor(private configService: ConfigService) {
        this.prismaClient = new PrismaClient({
            log: ['error', 'warn'],
            errorFormat: 'pretty',
        });
    }

    async onModuleInit() {
        await this.prismaClient.$connect();
        this.users = new UserService(this.prismaClient, this.configService);
        this.roles = new PrismaGenericRepository(this.prismaClient, 'role');
    }

    async onModuleDestroy() {
        await this.prismaClient.$disconnect();
    }
}

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IDataServices } from '../../core';
import { PrismaGenericRepository } from './generique-repo';
import {  Role } from "../../core/entities";
import { AbsUserService } from 'src/core/abstract/service/user-service.abstract';
import { UserService } from './services/user.service';
import { AbsEventService } from 'src/core/abstract/service/event-service.abstract';
import { EventService } from './services/event.service';
import { ConfigService } from '@nestjs/config';
import { AbsGiftService } from 'src/core/abstract/service/gift-service.abstract';
import { GiftService } from './services/gift.service';

@Injectable()
export class PrismaDataServices implements IDataServices, OnApplicationBootstrap {
    private prismaClient: PrismaClient = new PrismaClient();

    users: AbsUserService;
    roles: PrismaGenericRepository<Role>;
    events: AbsEventService;
    gifts: AbsGiftService;

    constructor(private configService: ConfigService) {}

    onApplicationBootstrap() {
        this.users = new UserService(this.prismaClient, this.configService);
        this.roles = new PrismaGenericRepository(this.prismaClient, 'role');
        this.events = new EventService(this.prismaClient);
        this.gifts = new GiftService(this.prismaClient);
        
    }
}

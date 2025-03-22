import { Module, Global } from '@nestjs/common';
import { PrismaDataServices } from './prisma-service.service';
import { IDataServices } from '../../core';

@Global() // Utilisez @Global() si vous voulez que PrismaService soit disponible globalement
@Module({
    providers: [
        {
            provide: IDataServices,
            useClass: PrismaDataServices,
        },
    ],
    exports: [IDataServices], // Exportez IDataServices pour l'utiliser dans d'autres modules
})
export class PrismaDataServicesModule { }
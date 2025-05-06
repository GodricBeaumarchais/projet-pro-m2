import { User, UserSafe } from "src/core";
import { PrismaGenericRepository } from "../generique-repo";
import { PrismaClient, Prisma } from "../../../../generated";
import { AbsUserService } from "src/core/abstract/service/user-service.abstract";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

export class UserService extends PrismaGenericRepository<User> implements AbsUserService {
    constructor(
        prismaClient: PrismaClient,
        private readonly configService: ConfigService
    ) {
        super(prismaClient, 'user');
    }

    private get client() {
        return this._client;
    }

    async getByEmail(email: string):  Promise<Partial<User>>  {
        return this.client.user.findUnique({
            where: { email }
        });
    }

    async getByRoleName(roleName: string): Promise<User[]> {
        return this.client.user.findMany({
            where: {
                role: {
                    titre: roleName,
                },
            }
        });
    }

    async create(item: Partial<User>): Promise<User> {
        const defaultRole = this.configService.get<string>('DEFAULT_ROLE_ID')
        const userData: Prisma.UserCreateInput = {
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            riotId: item.riotId,
            role: {
                connect: {
                    id: defaultRole,
                },
            },
        };

        return await this.client.user.create({
            data: userData,
        });
    }

    async delete(id: string): Promise<User> {
        return await this.client.user.delete({
            where: { id }
        });
    }

    async update(id: string, item: Partial<User>): Promise<User> {
        const userData: Prisma.UserUpdateInput = {
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            riotId: item.riotId,
        };
        return await this.client.user.update({
            where: { id },
            data: userData,
        });
    }

    async get(id: string): Promise<User | null> {
        return await this.client.user.findUnique({
            where: { id }
        });
    }

    async getUserSafe(id: string): Promise<UserSafe | null> {
        try {
            const user = await this.client.user.findUnique({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    riotId: true,
                },
                where: { id }
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;
        }
        catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAll(): Promise<User[]> {
        return await this.client.user.findMany();
    }



    async getSelf(userId: string): Promise<Partial<User>> { 
        return this.client.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                riotId: true,
                role: true,
            }
        });
    }


    async searchUsersByEmail(searchTerm: string): Promise<UserSafe[]> {
        try {
            const users = await this.client.user.findMany({
                where: {
                    email: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    riotId: true
                }
            });
            
            return users;
        } catch (error) {
            throw new HttpException('Erreur lors de la recherche des utilisateurs', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async modifySelf(userId: string, item: Partial<User>): Promise<Partial<User>> {
        try {
            const existingUser = await this.client.user.findUnique({
                where: { id: userId }
            });

            if (!existingUser) {
                throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
            }

            const updateData: Prisma.UserUpdateInput = {};
            if (item.lastName !== undefined) updateData.lastName = item.lastName;
            if (item.firstName !== undefined) updateData.firstName = item.firstName;
            if (item.email !== undefined) updateData.email = item.email;
            if (item.riotId !== undefined) updateData.riotId = item.riotId;
            
            return await this.client.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    riotId: true,
                    role: true
                }
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            if (error.code === 'P2025') {
                throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Erreur lors de la modification du profil', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
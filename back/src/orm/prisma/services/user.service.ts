import { User, UserSafe, Family } from "src/core";
import { PrismaGenericRepository } from "../generique-repo";
import { PrismaClient, Prisma } from "@prisma/client";
import { AbsUserService } from "src/core/abstract/service/user-service.abstract";
import { ConfigUtil } from '../../../util/config.util';
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
        const defaultAvatar = "/uploads/profile-pics/default.png"
        const userData: Prisma.UserCreateInput = {
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            password: item.password,
            avatar: defaultAvatar,
            birthDate: item.birthDate,
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
            avatar: item.avatar,
            birthDate: item.birthDate,
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
                    avatar: true,
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
                avatar: true,
                email: true,
                friends: true,
                friendOf: true,
                events: true,
                eventInvitations: true,
                giftsGiven: true,
                giftsReceived: true,
                role: true,
                birthDate: true
            }
        });
    }

    async getOtherUsers(userId: string): Promise<Partial<User>[]> {
        return this.client.user.findMany({
            where: { 
                id: { not: userId },
                AND: [
                    {
                        friends: {
                            none: {
                                id: userId
                            }
                        }
                    },
                    {
                        friendOf: {
                            none: {
                                id: userId
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true
            }
        });
    }

    async addFriend(userId: string, friendId: string): Promise<User> {
        return this.client.user.update({
            where: { id: userId },
            data: {
                friends: {
                    connect: { id: friendId }
                }
            },
            include: {
                friends: true,
                friendOf: true,
                events: true,
                eventInvitations: true
            }
        });
    }

    async removeFriend(userId: string, friendId: string): Promise<User> {
        await this.client.user.update({
            where: { id: friendId },
            data: {
                friends: {
                    disconnect: { id: userId }
                }
            }
        });

        return this.client.user.update({
            where: { id: userId },
            data: {
                friends: {
                    disconnect: { id: friendId }
                }
            },
            include: {
                friends: true,
                friendOf: true,
                events: true,
                eventInvitations: true
            }
        });
    }

    async getFriends(userId: string): Promise<UserSafe[]> {
        try {
            const user = await this.client.user.findUnique({
                where: { id: userId },
                select: {
                    friends: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            birthDate: true
                        }
                    },
                    friendOf: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            birthDate: true
                        }
                    }
                }
            });

            if (!user) {
                throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
            }

            // Fusionner les deux listes d'amis en évitant les doublons
            const allFriends = [...user.friends, ...user.friendOf];
            const uniqueFriends = Array.from(new Map(allFriends.map(friend => [friend.id, friend])).values());

            return uniqueFriends;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Erreur lors de la récupération des amis', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
        if (senderId === receiverId) {
            throw new HttpException('Vous ne pouvez pas vous envoyer une demande d\'ami à vous-même', HttpStatus.BAD_REQUEST);
        }

        const existingRequest = await this.client.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            }
        });

        if (existingRequest) {
            throw new HttpException('Une demande d\'ami existe déjà', HttpStatus.CONFLICT);
        }

        const existingFriendship = await this.client.user.findFirst({
            where: {
                id: senderId,
                friends: {
                    some: {
                        id: receiverId
                    }
                }
            }
        });

        if (existingFriendship) {
            throw new HttpException('Vous êtes déjà amis', HttpStatus.CONFLICT);
        }

        await this.client.friendRequest.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
                status: 'PENDING'
            }
        });
    }

    async acceptFriendRequest(senderId: string, receiverId: string): Promise<User> {
        const request = await this.client.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            }
        });

        if (!request || request.status !== 'PENDING') {
            throw new HttpException('Demande d\'ami non trouvée ou déjà traitée', HttpStatus.NOT_FOUND);
        }

        await this.client.friendRequest.update({
            where: {
                id: request.id
            },
            data: {
                status: 'ACCEPTED'
            }
        });

        return this.client.user.update({
            where: { id: receiverId },
            data: {
                friends: {
                    connect: { id: senderId }
                }
            },
            include: {
                friends: true,
                friendOf: true
            }
        });
    }

    async declineFriendRequest(senderId: string, receiverId: string): Promise<void> {
        const request = await this.client.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            }
        });

        if (!request || request.status !== 'PENDING') {
            throw new HttpException('Demande d\'ami non trouvée ou déjà traitée', HttpStatus.NOT_FOUND);
        }

        await this.client.friendRequest.update({
            where: {
                id: request.id
            },
            data: {
                status: 'REJECTED'
            }
        });
    }

    async getReceivedFriendRequests(userId: string) {
        const requests = await this.client.friendRequest.findMany({
            where: {
                receiverId: userId,
                status: 'PENDING'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
        return requests;
    }

    async getSentFriendRequests(userId: string) {
        const requests = await this.client.friendRequest.findMany({
            where: {
                senderId: userId,
                status: 'PENDING'
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
        return requests;
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
                    avatar: true
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
            if (item.avatar !== undefined) updateData.avatar = item.avatar;
            if (item.birthDate !== undefined) updateData.birthDate = item.birthDate;
            if (item.password !== undefined) {
                // Cryptage du mot de passe
                const bcrypt = require('bcrypt');
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(item.password, saltRounds);
            }
            
            return await this.client.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    email: true,
                    birthDate: true,
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
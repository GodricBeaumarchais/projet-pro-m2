import { Role } from "./role.entity";

export class User {
    id: string;
    password: string;
    avatar: string;
    lastName: string;
    firstName: string;
    email: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    role?: Role;
    roleId: string;
    giftsGiven?: any;
    giftsReceived?: any;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}




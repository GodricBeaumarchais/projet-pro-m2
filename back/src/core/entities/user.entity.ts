import { Role } from "./role.entity";
import { Family } from "./family.entity";

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
    familys?: Family[];
    giftsGiven?: any;
    giftsReceived?: any;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}




import { Role } from "./role.entity";

export class User {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    riotId: string;
    createdAt: Date;
    updatedAt: Date;
    role?: Role;
    roleId: string;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}




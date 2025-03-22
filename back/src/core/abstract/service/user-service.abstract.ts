import { IGenericRepository, User, UserSafe } from "src/core";

export abstract class AbsUserService extends IGenericRepository<User> {

    abstract getByRoleName(title: string): Promise<User[]>;

    abstract getUserSafe(id: string): Promise<UserSafe>;

    abstract getByEmail(email: string):  Promise<Partial<User>> ;

    abstract getSelf(userId: string): Promise<Partial<User>>;

    abstract getOtherUsers(userId: string): Promise<Partial<User>[]>;

    abstract searchUsersByEmail(searchTerm: string): Promise<UserSafe[]>;
}
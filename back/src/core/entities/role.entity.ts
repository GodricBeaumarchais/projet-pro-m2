import { User } from "./user.entity";

export class Role {
  id: string;
  titre: string;
  description: string;
  users?: User[];

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}

import { Role, User } from '../entities';
import { IGenericRepository } from './generic-repository.abstract';
import { AbsUserService } from './service/user-service.abstract';

export abstract class IDataServices {
  abstract users: AbsUserService;
  abstract roles: IGenericRepository<Role>;
}
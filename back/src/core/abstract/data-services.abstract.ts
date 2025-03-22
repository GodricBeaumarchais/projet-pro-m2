import { Role, User } from '../entities';
import { IGenericRepository } from './generic-repository.abstract';
import { AbsEventService } from './service/event-service.abstract';
import { AbsGiftService } from './service/gift-service.abstract';
import { AbsUserService } from './service/user-service.abstract';

export abstract class IDataServices {
  abstract users: AbsUserService;
  abstract roles: IGenericRepository<Role>;
  abstract events: AbsEventService;
  abstract gifts: AbsGiftService;
}
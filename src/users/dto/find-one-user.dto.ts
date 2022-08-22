import { PickType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.schema';

export class FindOneUserDto extends PickType(User, ['firstName', 'lastName'] as const) {}

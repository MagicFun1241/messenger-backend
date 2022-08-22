import { OmitType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.schema';

export class CreateUserDto extends OmitType(User, ['userName'] as const) {}

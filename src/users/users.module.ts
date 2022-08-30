import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '@/users/users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersGateway,
    UsersService,
  ],
  controllers: [UsersController],
  exports: [
    UsersService,
  ],
})
export class UsersModule {}

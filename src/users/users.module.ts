import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersGateway, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

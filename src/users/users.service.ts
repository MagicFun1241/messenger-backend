import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  findById(userId: number): Promise<User> {
    return this.UserModel.findById(userId).exec();
  }

  findByExternalId(externalId: number): Promise<User> {
    return this.UserModel.findOne({ externalId }).exec();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.UserModel(createUserDto);
    newUser.userName = 'int1m';
    return newUser.save();
  }
}

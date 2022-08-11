import { Model, Types } from 'mongoose';
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

  async findByExternalId(externalId: number): Promise<(UserDocument & { _id: Types.ObjectId }) | null> {
    const user = await this.UserModel.findOne({ externalId }).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument & { _id: Types.ObjectId }> {
    const newUser = new this.UserModel(createUserDto);
    newUser.userName = 'int1m';
    await newUser.save();
    return newUser;
  }

  async findByExternalIdOrCreate(createUserDto: CreateUserDto): Promise<UserDocument & { _id: Types.ObjectId }> {
    const user = await this.findByExternalId(createUserDto.externalId);
    if (user) {
      return user;
    }
    const newUser = await this.create(createUserDto);
    return newUser;
  }
}

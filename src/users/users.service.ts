import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async findOne(userId: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findById(userId).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.UserModel(createUserDto);
    newUser.userName = `user${newUser._id.toString()}`;
    await newUser.save();
    return newUser;
  }

  async findByExternalId(externalId: number): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({ externalId }).exec();
    return user;
  }

  async findByExternalIdOrCreate(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.findByExternalId(createUserDto.externalId);
    if (user) {
      return user;
    }
    const newUser = await this.create(createUserDto);
    return newUser;
  }

  async search(query: string): Promise<UserDocument[]> {
    const users = await this.UserModel.aggregate<UserDocument>([
      {
        $addFields: {
          fullName: { $concat: ['$firstName', '$lastName', '$userName'] },
        },
      },
      {
        $search: { fullName: query },
      },
    ]);

    return users;
  }

  async delete(userId: string): Promise<void> {
    await this.UserModel.deleteOne({
      _id: userId,
    });
  }
}

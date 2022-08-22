import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenExternal, TokenExternalDocument } from '@/authentication/schemas/token-external.schema';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(TokenExternal.name) private tokenExternal: Model<TokenExternalDocument>,
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

  async findByExternalId(service: string, externalId: number): Promise<UserDocument | null> {
    const t = await this.tokenExternal.findOne({ service, externalId }, { userId: 1 }).exec();
    const user = await this.UserModel.findById(t.userId);
    return user;
  }

  async findByExternalIdOrCreate(service: string, createUserDto: any): Promise<UserDocument> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const user = await this.findByExternalId(service, createUserDto.externalId);
    if (user) {
      return user;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

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

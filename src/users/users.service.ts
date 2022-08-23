import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private allowedTags = new Set<string>();

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async findById(userId: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findById(userId).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.UserModel(createUserDto);
    newUser.userName = `user${newUser._id.toString()}`;
    await newUser.save();
    return newUser;
  }

  private async findByExternalId(externalAccount: { service: string, id: string }): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      'externalAccounts.service': externalAccount.service,
      'externalAccounts.id': externalAccount.id,
    }).exec();
    return user;
  }

  async findByExternalIdOrCreate(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.findByExternalId(createUserDto.externalAccounts[0]);
    if (user) {
      return user;
    }
    const newUser = await this.create(createUserDto);
    return newUser;
  }

  async search(queryText: string, tags: Array<string> = null): Promise<UserDocument[]> {
    const aggregationQuery: Array<PipelineStage> = [];

    if (queryText != null && queryText !== '') {
      aggregationQuery.push({
        $addFields: {
          fullName: { $concat: ['$firstName', '$lastName', '$userName'] },
        },
      });

      aggregationQuery.push({
        $search: { fullName: queryText },
      });
    }

    if (tags != null) {
      aggregationQuery.unshift({
        $match: {
          tags: { $in: tags },
        },
      });
    }

    const users = await this.UserModel.aggregate<UserDocument>(aggregationQuery);
    return users;
  }

  async delete(userId: string): Promise<void> {
    await this.UserModel.deleteOne({
      _id: userId,
    });
  }

  tagAllowed(value: string) {
    return this.allowedTags.has(value);
  }

  addAllowedTags(items: string[]) {
    items.forEach((item) => {
      this.allowedTags.add(item);
    });
  }
}

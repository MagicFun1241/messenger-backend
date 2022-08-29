import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, PipelineStage } from 'mongoose';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

// import { ShortName, ShortNameDocument } from '@/names/schemas/name.schema';
import { ExternalAccount, User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ExternalSearchApiResult, ExternalSearchItem } from './@types/users.types';

@Injectable()
export class UsersService {
  private allowedTags = new Set<string>();

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async findById(userId: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findById(userId).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.UserModel(createUserDto);
    // const name = await this.ShortNameModel.create({
    //   value: `user${newUser._id.toString()}`,
    //   user: newUser._id,
    // });

    // newUser.shortName = name;
    newUser.userName = `user${newUser._id.toString()}`;
    newUser.type = 'userTypeRegular';
    await newUser.save();
    return newUser;
  }

  private async findByExternalId(externalAccount: ExternalAccount): Promise<UserDocument | null> {
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

  async search(queryText: string, tags: Array<string> = undefined): Promise<UserDocument[]> {
    const aggregationQuery: Array<PipelineStage> = [];

    aggregationQuery.push({
      $addFields: {
        fullName: {
          $concat: ['$lastName', ' ', 'firstName'],
        },
      },
    });

    aggregationQuery.push({
      $match: {
        fullName: {
          $regex: queryText,
          $options: 'i',
        },
      },
    });

    if (tags) {
      aggregationQuery.unshift({
        $match: {
          tags: { $in: tags },
        },
      });
    }

    const users = await this.UserModel.aggregate<UserDocument>(aggregationQuery);
    return users;
  }

  async searchByExternalService(query: string): Promise<Array<ExternalSearchItem>> {
    const urlSearchParams = new URLSearchParams({
      fullName: query,
      token: this.configService.get('TOKEN_LK'),
      env: process.env.NODE_ENV,
    }).toString();

    const response = await fetch(`https://dev.lk.volsu.ru/search/find-users-by-full-name?${urlSearchParams}`);
    const result = await response.json() as Array<ExternalSearchApiResult>;

    if (response.status > 201) {
      throw new WsFormatException('Internal server error');
    }

    const searchedUsers: Array<ExternalSearchItem> = result.map((user) => ({
      externalId: user.id,
      title: user.username,
    }));

    return searchedUsers;
  }

  async existsWithExternalId(service: string, id: string) {
    return this.UserModel.exists({ externalAccounts: { $in: [{ service, id }] } });
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

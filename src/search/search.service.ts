import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UsersService } from '@/users/users.service';

import { User } from '@/users/schemas/user.schema';
import { ApiUser } from '@/users/@types/api/users.types';

import {
  ExternalSearchApiResponse, ExternalSearchApiResult,
} from './@types/search.types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  private async searchByExternalService(query: string): Promise<Array<ExternalSearchApiResult>> {
    const urlSearchParams = new URLSearchParams({
      fullName: query,
      token: this.configService.get('TOKEN_EXTERNAL_SECRET'),
      env: process.env.NODE_ENV || 'development',
    }).toString();

    const response = await fetch(`https://dev.lk.volsu.ru/search/find-users-by-full-name?${urlSearchParams}`);
    const { result } = await response.json() as ExternalSearchApiResponse;

    if (response.status > 201) {
      throw new WsFormatException(`Internal server error. Status ${response.status}`);
    }

    return result;
  }

  async usersSearch(query: string, userId: string): Promise<Array<ApiUser>> {
    const searchedUsers: ApiUser[] = (await this.userService.search(query)).map((localUser) => ({
      ...localUser as User,
      id: localUser._id.toString(),
      isSelf: userId === localUser._id.toString() ? true : undefined,
    }));

    const externalUsers = await this.searchByExternalService(query);

    /**
     * Add external user if he don`t find in searchedUsers (local)
     */
    externalUsers.forEach((externalUser) => {
      const localUserFindResult = searchedUsers.find(
        (localUser) => localUser.externalAccounts
          .find((externalAccount) => externalAccount.service === 'volsu'
            && externalAccount.id === externalUser.id),
      );
      if (!localUserFindResult) {
        searchedUsers.push({
          id: externalUser.id,
          firstName: externalUser.firstName,
          lastName: externalUser.lastName,
          middleName: externalUser.middleName,
          email: '',
          photos: undefined,
          userName: undefined,
          dateOfBirth: new Date(),
          type: 'userTypeUnLinked',
          wasOnline: new Date(),
          isVerified: false,
          externalAccounts: [{ service: 'volsu', id: externalUser.id }],
        });
      }
    });

    return searchedUsers;
  }
}

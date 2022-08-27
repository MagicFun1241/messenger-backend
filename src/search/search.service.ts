import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UsersService } from '@/users/users.service';

import {
  ExternalSearchApiResponse,
  ExternalSearchItem, SearchUserItem,
} from './@types/search.types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  private async searchByExternalService(query: string): Promise<Array<ExternalSearchItem>> {
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

    const searchedUsers: Array<ExternalSearchItem> = result.map((user) => ({
      externalId: user.id,
      title: user.username,
    }));

    return searchedUsers;
  }

  async usersSearch(query: string): Promise<Array<SearchUserItem>> {
    const searchedUsers: Array<SearchUserItem> = [];

    const externalUsers = await this.searchByExternalService(query);
    const localUsers = await this.userService.search(query);

    /**
     * Remove externalUser if he is linked
     */
    externalUsers.forEach((externalUser, index) => {
      const localUserFindResult = localUsers.find(
        (localUser) => localUser.externalAccounts
          .find((externalAccount) => externalAccount.service === 'volsu'
            && externalAccount.id === externalUser.externalId),
      );
      if (localUserFindResult) {
        externalUsers.splice(index, 1);
      } else {
        searchedUsers.push({
          id: externalUser.externalId,
          title: externalUser.title,
          label: 'NOT_LINKED',
          avatar: undefined,
          verified: false,
          isLinked: false,
        });
      }
    });

    return searchedUsers;
  }
}

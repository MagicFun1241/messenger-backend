import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UsersService } from '@/users/users.service';

import { ExternalServiceApiResponse } from '@/@types/externalService';
import { UserExternal } from '@/users/@types/usersExternal.types';
import { ApiUser } from '@/users/@types/api/users.types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  private async searchUsersByExternalService(query: string): Promise<Pick<UserExternal, 'id' | 'firstName'>[]> {
    const urlSearchParams = new URLSearchParams({
      query,
      token: this.configService.get('TOKEN_EXTERNAL_SECRET'),
      env: process.env.NODE_ENV || 'development',
    }).toString();

    const response = await fetch(`https://dev.lk.volsu.ru/search/find-users-by-full-name?${urlSearchParams}`);

    const { result } = await response.json() as ExternalServiceApiResponse<Pick<UserExternal, 'id' | 'firstName'>[]>;

    if (response.status > 201) {
      throw new WsFormatException(`Internal server error. Status ${response.status}`);
    }

    return result;
  }

  async usersSearch(query: string, currentUserId: string): Promise<Array<ApiUser>> {
    const searchedUsers: ApiUser[] = (await this.userService.search(query)).map((user) => {
      // В дальнейшем можно будет проверять политику каждого пользователя на возможность его найти
      if (currentUserId === user._id.toString()) {
        return null;
      }

      return {
        id: user._id.toString(),
        type: user.type,
        firstName: user.firstName,
        lastName: user?.lastName,
        userName: user?.userName,
        isVerified: user?.isVerified,
        lastActivity: user?.lastActivity,
        externalAccounts: user?.externalAccounts,
      };
    }).filter((e) => e !== null);

    try {
      const externalUsers = await this.searchUsersByExternalService(query);

      /**
       * Add external user if he don`t find in searchedUsers (local)
       */
      if (Array.isArray(externalUsers)) {
        externalUsers.forEach((externalUser) => {
          // Тут опасно, надо включить проверку на null
          const localUserFindResult = searchedUsers.find(
            (localUser) => (Array.isArray(localUser.externalAccounts) ? localUser.externalAccounts
              .find((externalAccount) => externalAccount.service === 'volsu'
                && externalAccount.id === externalUser.id) : false),
          );
          if (!localUserFindResult) {
            searchedUsers.push({
              id: externalUser.id,
              type: 'userTypeUnLinked',
              firstName: externalUser.firstName,
              externalAccounts: [{ id: externalUser.id, service: 'volsu' }],
            });
          }
        });
      }
    } catch (e) {
      this.logger.log(e);
    }

    return searchedUsers;
  }
}

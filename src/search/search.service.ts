import { Injectable, Logger } from '@nestjs/common';
import { ExternalSearchApiResult, ExternalSearchItem } from '@/users/@types/users.types';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async searchByExternalService(query: string): Promise<Array<ExternalSearchItem>> {
    const urlSearchParams = new URLSearchParams({
      fullName: query,
      token: this.configService.get('TOKEN_EXTERNAL_SECRET'),
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
}

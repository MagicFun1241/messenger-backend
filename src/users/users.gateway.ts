import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { FindByQueryDto } from '@/users/dto/findByQuery.dto';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';
import { UpdateMeDto } from '@/users/dto/updateMe.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ExternalSearchQueryDto } from '@/users/dto/externalSearchQuery.dto';
import { FindByIdDto } from './dto/findById.dto';
import { UsersService } from './users.service';

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;

  photo?: string;
  tags: Array<string>;

  dateOfBirth?: Date;

  policy?: any;
}

interface ResultItem {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  middlename: string | null;
}

interface ExternalSearchItem {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName: string;

  linked: boolean;
}

@WebSocketGateway(8080, {
  cors: true,
})
export class UsersGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @SubscribeMessage('findUserById')
  async findOneUserHandler(
    @MessageBody() body: FindByIdDto,
  ): Promise<UserItem> {
    const result = await this.usersService.findById(body.id);
    if (result == null) {
      throw new WsFormatException('Not found');
    }

    return {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      tags: result.tags,
    };
  }

  @SubscribeMessage('findMe')
  async findMe(
    @ConnectedSocket() client: WebSocketEntity,
  ): Promise<UserItem> {
    const me = await this.usersService.findById(client.id);

    // TODO: Реализовать когда-нибудь двухфакторную аутентификацию
    return {
      id: me._id,
      firstName: me.firstName,
      lastName: me.lastName,
      tags: me.tags,
    };
  }

  @SubscribeMessage('updateMe')
  async updateMe(
  @MessageBody() body: UpdateMeDto,
    @ConnectedSocket() client: WebSocketEntity,
  ) {
    return {};
  }

  @SubscribeMessage('findUsersByQuery')
  async search(
  @MessageBody() body: FindByQueryDto,
  ) {
    const r = await this.usersService.search(body.query, body.tags);
    return r.map((e) => ({
      id: e._id,
      firstName: e.firstName,
      lastName: e.lastName,
      tags: e.tags,
    }));
  }

  @SubscribeMessage('findExternalUsersByQuery')
  async externalSearch(
  @MessageBody() body: ExternalSearchQueryDto,
  ) {
    const r = await axios.get<{
      status: boolean;
      result: Array<any> | false;
    }>('https://dev.lk.volsu.ru/search/find-users-by-full-name', {
      params: {
        fullName: body.query,
        token: this.configService.get('TOKEN_LK'),
        env: process.env.NODE_ENV,
      },
    });

    if (!r.data.status) {
      throw new WsFormatException('Internal server error');
    }

    return {
      volsu: await Promise.all((r.data.result as Array<ResultItem>).map(async (e) => {
        let ri: ExternalSearchItem = {
          id: e.id,
          fullName: e.username,
        } as any;

        ri.linked = (await this.usersService.existsWithExternalId('volsu', e.id)) != null;

        const parts = e.username.split(' ');
        if (parts.length > 1) {
          const [lastName, firstName, middleName] = parts;
          ri = {
            ...ri, lastName, firstName, middleName,
          };
        }

        return ri;
      })),
    };
  }
}

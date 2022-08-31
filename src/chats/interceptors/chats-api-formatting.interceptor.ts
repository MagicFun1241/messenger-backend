import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { WsResponse } from '@/ws/interfaces/ws.response.interface';

import { ChatDocument } from '../schemas/chats.schema';
import { ApiChat } from '../@types/api/chats.type';

@Injectable()
export class ChatsApiFormattingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<WsResponse<ChatDocument>>,
  ): Observable<WsResponse<ApiChat>> | Promise<Observable<ApiChat>> {
    return next
      .handle()
      .pipe(
        map<WsResponse<ChatDocument>, WsResponse<ApiChat>>((chat) => ({
          event: chat.event,
          data: {
            status: chat.data.status,
            data: {
              id: chat.data.data._id.toString(),
              type: chat.data.data.type,
              fullInfo: {
                members: chat.data.data.members.map((chatMember) => ({
                  userId: chatMember.userId.toString(),
                })),
              },
            },
          },
        })),
      );
  }
}

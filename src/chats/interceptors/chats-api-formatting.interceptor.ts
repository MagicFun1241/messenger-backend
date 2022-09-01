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
    next: CallHandler<WsResponse<ChatDocument[]>>,
  ): Observable<WsResponse<ApiChat[]>> | Promise<Observable<ApiChat[]>> {
    return next
      .handle()
      .pipe(
        map<WsResponse<ChatDocument[]>, WsResponse<ApiChat[]>>((chats) => ({
          event: chats.event,
          data: {
            status: chats.data.status,
            data: chats.data.data.map((chat) => ({
              id: chat._id.toString(),
              type: chat.type,
              title: chat.title,
              fullInfo: {
                members: chat.fullInfo.members.map((chatMember) => ({
                  userId: chatMember.userId.toString(),
                })),
              },
            })),
          },
        })),
      );
  }
}

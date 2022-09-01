import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { WsResponse } from '@/ws/interfaces/ws.response.interface';

import { UserDocument } from '@/users/schemas/user.schema';
import { ChatDocument } from '../schemas/chats.schema';
import { ApiChat } from '../@types/api/chats.type';

@Injectable()
export class ChatsApiFormattingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<WsResponse<{ chat: ChatDocument[], currentUserId: string }>>,
  ): Observable<WsResponse<ApiChat[]>> | Promise<Observable<ApiChat[]>> {
    return next
      .handle()
      .pipe(
        map<WsResponse<{ chat: ChatDocument[], currentUserId: string }>, WsResponse<ApiChat[]>>((response) => ({
          event: response.event,
          data: {
            status: response.data.status,
            data: response.data.data.chat.map((chat) => {
              const chatTitle = chat.type === 'chatTypePrivate' || chat.type === 'chatTypeSecret'
                ? chat.fullInfo.members
                  .find((chatMember) => chatMember.userId._id.toString() !== response.data.data.currentUserId)
                  .userId as UserDocument
                : undefined;
              if (chatTitle?.firstName) {
                chat.title = `${chatTitle?.firstName} ${chatTitle?.lastName ? chatTitle?.lastName : ''}`;
              }

              return {
                id: chat._id.toString(),
                type: chat.type,
                title: chat.title,
                fullInfo: {
                  members: chat.fullInfo.members.map((chatMember) => ({
                    userId: chatMember.userId.toString(),
                  })),
                },
              };
            }),
          },
        })),
      );
  }
}

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserDocument } from '@/users/schemas/user.schema';
import { ApiUser } from '@/users/@types/api/users.types';
import { WsResponse } from '@/ws/interfaces/ws.response.interface';

export class UserApiFormattingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler)
    : Observable<WsResponse<ApiUser>> | Promise<Observable<ApiUser>> {
    return next
      .handle()
      .pipe(
        map<WsResponse<UserDocument>, WsResponse<ApiUser>>((user) => ({
          event: user.event,
          data: {
            status: true,
            data: {
              id: user.data.data._id.toString(),
              type: user.data.data.type,
              firstName: user.data.data.firstName,
              lastName: user.data.data.lastName,
              // shortName: user.data.data.shortName._id.toString(),
              tags: user.data.data.tags,
            },
          },
        })),
      );
  }
}

import { Module } from '@nestjs/common';

import { WsModule } from '@/ws/ws.module';
import { AuthenticationModule } from '@/authentication/authentication.module';
import { UsersModule } from '@/users/users.module';

import { SearchService } from './search.service';
import { SearchGateway } from './search.gateway';

@Module({
  imports: [
    WsModule,
    AuthenticationModule,
    UsersModule,
  ],
  providers: [
    SearchService,
    SearchGateway,
  ],
})
export class SearchModule {}

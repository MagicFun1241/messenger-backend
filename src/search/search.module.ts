import { Module } from '@nestjs/common';

import { WsModule } from '@/ws/ws.module';
import { AuthenticationModule } from '@/authentication/authentication.module';

import { SearchService } from './search.service';
import { SearchGateway } from './search.gateway';

@Module({
  imports: [
    WsModule,
    AuthenticationModule,
  ],
  providers: [
    SearchService,
    SearchGateway,
  ],
})
export class SearchModule {}

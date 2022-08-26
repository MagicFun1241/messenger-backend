import { Module } from '@nestjs/common';

import { AuthenticationModule } from '@/authentication/authentication.module';

import { SearchService } from './search.service';
import { SearchGateway } from './search.gateway';

@Module({
  imports: [
    AuthenticationModule,
  ],
  providers: [
    SearchService,
    SearchGateway,
  ],
})
export class SearchModule {}

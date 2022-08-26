import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '@/authentication/authentication.module';

import { SearchService } from './search.service';
import { SearchGateway } from './search.gateway';

@Module({
  imports: [
    AuthenticationModule,
    JwtModule,
  ],
  providers: [
    SearchService,
    SearchGateway,
  ],
})
export class SearchModule {}

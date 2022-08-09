import { Module } from '@nestjs/common';
import { WsAdapterService } from './ws-adapter.service';

@Module({
  providers: [WsAdapterService],
})
export class WsAdapterModule {}

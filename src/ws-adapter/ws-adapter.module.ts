import { Module } from '@nestjs/common';
import { WsAdapterService } from './ws-adapter.service';

@Module({
  providers: [WsAdapterService],
  exports: [WsAdapterService],
})
export class WsAdapterModule {}

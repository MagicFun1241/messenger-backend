import { Module } from '@nestjs/common';
import { ExtensionsService } from '@/extentions/extensions.service';

@Module({
  providers: [ExtensionsService],
  exports: [ExtensionsService],
})
export class ExtensionsModule {}

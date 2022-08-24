import { Module } from '@nestjs/common';
import { ExtensionsService } from '@/extentions/extensions.service';

@Module({
  exports: [ExtensionsService],
})
export class ExtensionsModule {}

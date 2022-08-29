import { Module } from '@nestjs/common';
import { NamesService } from '@/names/names.service';
import { NamesGateway } from '@/names/names.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortName, ShortNameSchema } from '@/names/schemas/name.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ShortName.name, schema: ShortNameSchema }])],
  providers: [
    NamesService,
    NamesGateway,
  ],
})
export class NamesModule {}

import { Module } from '@nestjs/common';
import { NamesService } from '@/names/names.service';
import { NamesGateway } from '@/names/names.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortName, ShortNameSchema } from '@/names/schemas/name.schema';

/**
 * Не знаю как это завести в текущем виде, по сути если мы хотим это юзать, нужно прокидывать сервис,
 * или делать подключение к этой схеме в другом модуле (может сработает)
 * Пока закоменчу все, чтобы завести, не трогай пока, обдумаем что с этим делать
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ShortName.name, schema: ShortNameSchema }]),
  ],
  providers: [
    NamesService,
    NamesGateway,
  ],
  exports: [
    NamesService,
  ],
})
export class NamesModule {}

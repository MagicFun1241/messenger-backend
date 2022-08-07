import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModuleService } from '@/test-module/test-module.service';
import { TestModuleGateway } from '@/test-module/test-module.gateway';
import { TestModuleSchema, TestModule } from '@/test-module/schemas/test-module.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TestModule.name, schema: TestModuleSchema, collection: 'test-module' }])],
  providers: [TestModuleGateway, TestModuleService],
})
export class TestModuleModule {}

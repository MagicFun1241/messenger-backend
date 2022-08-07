import { PartialType } from '@nestjs/mapped-types';
import { TestModule } from '@/test-module/schemas/test-module.schema';

export class UpdateTestModuleDto extends PartialType(TestModule) {
  id: number;
}

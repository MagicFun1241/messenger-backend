import { Test, TestingModule } from '@nestjs/testing';
import { TestModuleService } from '@/test-module/test-module.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestModule } from '@/test-module/schemas/test-module.schema';

describe('TestModuleService', () => {
  let service: TestModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestModuleService, {
        provide: getModelToken(TestModule.name),
        useValue: Model,
      }],
    }).compile();

    service = module.get<TestModuleService>(TestModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

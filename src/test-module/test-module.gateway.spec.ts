import { Test, TestingModule } from '@nestjs/testing';
import { TestModuleGateway } from '@/test-module/test-module.gateway';
import { TestModuleService } from '@/test-module/test-module.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestModule } from '@/test-module/schemas/test-module.schema';

describe('TestModuleGateway', () => {
  let gateway: TestModuleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestModuleGateway, TestModuleService, {
        provide: getModelToken(TestModule.name),
        useValue: Model,
      }],
    }).compile();

    gateway = module.get<TestModuleGateway>(TestModuleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

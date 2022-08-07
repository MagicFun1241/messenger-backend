import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestModule, TestModuleDocument } from '@/test-module/schemas/test-module.schema';

@Injectable()
export class TestModuleService {
  constructor(@InjectModel(TestModule.name) private TestModuleModel: Model<TestModuleDocument>) {}

  async create(createTestModuleDto: TestModule): Promise<TestModule> {
    const createdModule = new this.TestModuleModel(createTestModuleDto);
    return createdModule.save();
  }

  async findAll(): Promise<TestModule[]> {
    return this.TestModuleModel.find().exec();
  }
}

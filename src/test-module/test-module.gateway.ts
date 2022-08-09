import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TestModule } from '@/test-module/schemas/test-module.schema';
import { TestModuleService } from '@/test-module/test-module.service';

@WebSocketGateway(8080, {
  cors: true,
})
export class TestModuleGateway {
  constructor(private readonly testModuleService: TestModuleService) {}

  @SubscribeMessage('createTestModule')
  async create(@MessageBody() createTestModuleDto: TestModule) {
    const testModuleCreated = await this.testModuleService.create(createTestModuleDto);
    return testModuleCreated;
  }

  @SubscribeMessage('findAllTestModule')
  async findAll() {
    const testModuleAll = await this.testModuleService.findAll();
    return testModuleAll;
  }
}

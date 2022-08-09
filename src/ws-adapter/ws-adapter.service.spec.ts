import { Test, TestingModule } from '@nestjs/testing';
import { WsAdapterService } from './ws-adapter.service';

describe('WsAdapterService', () => {
  let service: WsAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsAdapterService],
    }).compile();

    service = module.get<WsAdapterService>(WsAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BasicvalueService } from './basicvalue.service';

describe('BasicvalueService', () => {
  let service: BasicvalueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicvalueService],
    }).compile();

    service = module.get<BasicvalueService>(BasicvalueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

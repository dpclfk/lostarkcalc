import { Test, TestingModule } from '@nestjs/testing';
import { LastreqService } from './lastreq.service';

describe('LastreqService', () => {
  let service: LastreqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastreqService],
    }).compile();

    service = module.get<LastreqService>(LastreqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DetailitemService } from './detailitem.service';

describe('DetailitemService', () => {
  let service: DetailitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailitemService],
    }).compile();

    service = module.get<DetailitemService>(DetailitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

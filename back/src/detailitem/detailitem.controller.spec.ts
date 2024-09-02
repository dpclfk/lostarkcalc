import { Test, TestingModule } from '@nestjs/testing';
import { DetailitemController } from './detailitem.controller';
import { DetailitemService } from './detailitem.service';

describe('DetailitemController', () => {
  let controller: DetailitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailitemController],
      providers: [DetailitemService],
    }).compile();

    controller = module.get<DetailitemController>(DetailitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

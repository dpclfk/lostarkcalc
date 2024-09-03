import { Test, TestingModule } from '@nestjs/testing';
import { LastreqController } from './lastreq.controller';
import { LastreqService } from './lastreq.service';

describe('LastreqController', () => {
  let controller: LastreqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LastreqController],
      providers: [LastreqService],
    }).compile();

    controller = module.get<LastreqController>(LastreqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

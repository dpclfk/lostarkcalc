import { Test, TestingModule } from '@nestjs/testing';
import { Basicvalue } from './basicvalue';

describe('Basicvalue', () => {
  let provider: Basicvalue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Basicvalue],
    }).compile();

    provider = module.get<Basicvalue>(Basicvalue);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

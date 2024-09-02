import { MarketapiMiddleware } from './marketapi.middleware';

describe('MarketapiMiddleware', () => {
  it('should be defined', () => {
    expect(new MarketapiMiddleware()).toBeDefined();
  });
});

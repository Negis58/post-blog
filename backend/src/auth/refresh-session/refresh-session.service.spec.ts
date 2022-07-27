import { Test, TestingModule } from '@nestjs/testing';
import { RefreshSessionService } from './refresh-session.service';

describe('RefreshSessionService', () => {
  let service: RefreshSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshSessionService],
    }).compile();

    service = module.get<RefreshSessionService>(RefreshSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HashtagLogService } from './hashtag-log.service';

describe('HashtagLogService', () => {
  let service: HashtagLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashtagLogService],
    }).compile();

    service = module.get<HashtagLogService>(HashtagLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

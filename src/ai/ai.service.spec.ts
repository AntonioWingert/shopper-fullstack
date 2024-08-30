import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  const aiServiceMock = {
    onModuleInit: jest.fn(),
    createGenerativeModel: jest.fn(),
    readImage: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AiService, useValue: aiServiceMock }],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create generative model', async () => {
    await service.onModuleInit();
    expect(aiServiceMock.onModuleInit).toHaveBeenCalled();
  });

  it('should read image', async () => {
    const imagePath = 'test-image-path';
    const mimeType = 'test-mime-type';
    const value = 'test-content';
    const uri = 'test-uri';

    aiServiceMock.readImage.mockResolvedValueOnce({ value, uri });

    expect(await service.readImage(imagePath, mimeType)).toEqual({
      value: 'test-content',
      uri: 'test-uri',
    });
  });
});

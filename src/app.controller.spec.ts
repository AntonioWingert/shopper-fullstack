import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateMeasureDto } from './dto/create.measure.dto';
import { PatchMeasureDto } from './dto/patch.measure.dto';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    upload: jest.fn(),
    confirm: jest.fn(),
    list: jest.fn(),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AppController', () => {
    it('upload', () => {
      const body: CreateMeasureDto = {
        customer_code: 'test',
        measure_type: 'GAS',
        image: 'data:image/png;base64,',
        measure_datetime: new Date(),
      };

      appController.upload(body);
      expect(mockAppService.upload).toHaveBeenCalledWith(body);
      expect(mockAppService.upload).toHaveBeenCalledTimes(1);
    });

    it('confirm', () => {
      const body: PatchMeasureDto = {
        measure_uuid: 'test',
        confirmed_value: 1,
      };

      appController.confirm(body);
      expect(mockAppService.confirm).toHaveBeenCalledWith(body);
      expect(mockAppService.confirm).toHaveBeenCalledTimes(1);
    });

    it('list', () => {
      const customer_code = 'test';
      const measure_type = 'GAS';

      appController.list(customer_code, measure_type);
      expect(mockAppService.list).toHaveBeenCalledWith(
        customer_code,
        measure_type,
      );
      expect(mockAppService.list).toHaveBeenCalledTimes(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';
import { MeasureService } from './measure/measure.service';
import { CreateMeasureDto } from './dto/create.measure.dto';
import { HttpException } from '@nestjs/common';

describe('AppService', () => {
  let appService: AppService;

  const mockAppService = {
    convertBase64ToImage: jest.fn(),
    upload: jest.fn(),
    verifyIfMeasureExists: jest.fn(),
    confirm: jest.fn(),
    list: jest.fn(),
  };

  const mockMeasureService = {
    createMeasure: jest.fn(),
    getMeasures: jest.fn(),
    getMeasureById: jest.fn(),
    updateMeasure: jest.fn(),
    getMeasuresByCustomerCode: jest.fn(),
  };

  const mockAiService = {
    readImage: jest.fn(),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: MeasureService, useValue: mockMeasureService },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('Invalid base64 string', async () => {
      const base64 = 'data:image/png;base64,';
      const outputPath = 'test.jpg';

      await expect(
        appService.convertBase64ToImage(base64, outputPath),
      ).rejects.toThrowError('Invalid base64 string');
    });

    it('DoubleReportException', async () => {
      const body: CreateMeasureDto = {
        customer_code: 'test',
        measure_type: 'GAS',
        image: 'data:image/jpeg;base64,validbase64string',
        measure_datetime: new Date('2024-08-30T18:42:22.908Z'),
      };

      mockMeasureService.getMeasures.mockReturnValueOnce(body);

      try {
        await appService.upload(body);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Leitura do mês já realizada');
      }
    });

    it('Upload success', async () => {
      const body: CreateMeasureDto = {
        customer_code: 'test',
        measure_type: 'GAS',
        image: 'data:image/jpeg;base64,validbase64string',
        measure_datetime: new Date('2024-08-30T18:42:22.908Z'),
      };

      mockAiService.readImage.mockReturnValueOnce({ value: 1, uri: 'test' });

      mockMeasureService.createMeasure.mockReturnValueOnce({
        id: '1',
        measure_value: 1,
        measure_type: body.measure_type,
        measure_date: body.measure_datetime,
        customer_code: body.customer_code,
        verified: false,
      });

      expect(await appService.upload(body)).toEqual({
        image_url: 'test',
        measure_value: 1,
        measure_uuid: '1',
      });
    });
  });

  describe('confirm', () => {
    it('MeasureNotFoundException', async () => {
      const body = {
        measure_uuid: '1',
        confirmed_value: 1,
      };

      mockMeasureService.getMeasureById.mockReturnValueOnce(null);

      try {
        await appService.confirm(body);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Leitura do mês não encontrada');
      }
    });

    it('ConfirmationDuplicateException', async () => {
      const body = {
        measure_uuid: '1',
        confirmed_value: 1,
      };

      mockMeasureService.getMeasureById.mockReturnValueOnce({
        id: '1',
        measure_value: 1,
        measure_type: 'GAS',
        measure_date: new Date('2024-08-30T18:42:22.908Z'),
        customer_code: 'test',
        verified: true,
      });

      try {
        await appService.confirm(body);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Leitura do mês já confirmada');
      }
    });

    it('Confirm success', async () => {
      const body = {
        measure_uuid: '1',
        confirmed_value: 1,
      };

      mockMeasureService.getMeasureById.mockReturnValueOnce({
        id: '1',
        measure_value: 1,
        measure_type: 'GAS',
        measure_date: new Date('2024-08-30T18:42:22.908Z'),
        customer_code: 'test',
        verified: false,
      });

      expect(await appService.confirm(body)).toEqual({ success: true });
    });
  });

  describe('list', () => {
    it('NotFoundException', async () => {
      const customer_code = 'test';
      const measure_type = 'GAS';

      mockMeasureService.getMeasuresByCustomerCode.mockReturnValueOnce([]);

      try {
        await appService.list(customer_code, measure_type);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Leitura do mês não encontrada');
      }
    });

    it('List success', async () => {
      const customer_code = 'test';
      const measure_type = 'GAS';

      mockMeasureService.getMeasuresByCustomerCode.mockReturnValueOnce([
        {
          id: '1',
          measure_value: 1,
          measure_type: 'GAS',
          measure_date: new Date('2024-08-30T18:42:22.908Z'),
          customer_code: 'test',
          verified: false,
        },
      ]);

      expect(await appService.list(customer_code, measure_type)).toEqual({
        customer_code: 'test',
        measures: [
          {
            id: '1',
            measure_value: 1,
            measure_type: 'GAS',
            measure_date: new Date('2024-08-30T18:42:22.908Z'),
            customer_code: 'test',
            verified: false,
          },
        ],
      });
    });
  });
});

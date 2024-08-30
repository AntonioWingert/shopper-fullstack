import { Test, TestingModule } from '@nestjs/testing';
import { MeasureService } from './measure.service';

describe('MeasureService', () => {
  let service: MeasureService;

  const measureService = {
    createMeasure: jest.fn(),
    getMeasureById: jest.fn(),
    updateMeasure: jest.fn(),
    getMeasuresByCustomerCode: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: MeasureService, useValue: measureService }],
    }).compile();

    service = module.get<MeasureService>(MeasureService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create measure', async () => {
    const measure = {
      id: 'test-id',
      measure_uuid: 'test',
      measure_value: 1,
      measure_type: 'GAS',
      measure_date: new Date('2024-08-30T18:42:22.908Z'),
      customer_code: 'test',
      verified: false,
    };

    jest.spyOn(service, 'createMeasure').mockResolvedValueOnce(measure);

    expect(await service.createMeasure(measure)).toBe(measure);
  });

  it('should get measure by id', async () => {
    const measure = {
      id: 'test-id',
      measure_uuid: 'test',
      measure_value: 1,
      measure_type: 'GAS',
      measure_date: new Date('2024-08-30T18:42:22.908Z'),
      customer_code: 'test',
      verified: false,
    };

    jest.spyOn(service, 'getMeasureById').mockResolvedValueOnce(measure);

    expect(await service.getMeasureById('test')).toBe(measure);
  });

  it('should update measure', async () => {
    const measure = {
      id: 'test-id',
      measure_uuid: 'test',
      measure_value: 1,
      measure_type: 'GAS',
      measure_date: new Date('2024-08-30T18:42:22.908Z'),
      customer_code: 'test',
      verified: false,
    };

    jest.spyOn(service, 'updateMeasure').mockResolvedValueOnce(measure);

    expect(await service.updateMeasure('test', 2)).toBe(measure);
  });

  it('should get measures by customer code', async () => {
    const measure = {
      id: 'test-id',
      measure_uuid: 'test',
      measure_value: 1,
      measure_type: 'GAS',
      measure_date: new Date('2024-08-30T18:42:22.908Z'),
      customer_code: 'test',
      verified: false,
    };

    jest
      .spyOn(service, 'getMeasuresByCustomerCode')
      .mockResolvedValueOnce([measure]);

    expect(await service.getMeasuresByCustomerCode('test')).toEqual([measure]);
  });
});

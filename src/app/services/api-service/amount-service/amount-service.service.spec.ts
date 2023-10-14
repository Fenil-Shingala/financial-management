import { TestBed } from '@angular/core/testing';

import { AmountServiceService } from './amount-service.service';

describe('AmountServiceService', () => {
  let service: AmountServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmountServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

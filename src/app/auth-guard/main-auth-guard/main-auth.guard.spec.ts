import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mainAuthGuard } from './main-auth.guard';

describe('mainAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mainAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

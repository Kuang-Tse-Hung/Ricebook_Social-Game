import { TestBed } from '@angular/core/testing';

import { BaselayoutService } from './baselayout.service';

describe('BaselayoutService', () => {
  let service: BaselayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaselayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { UsermanagementService } from './usermanagement.service';

describe('UsermanagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsermanagementService]
    });
  });

  it('should be created', inject([UsermanagementService], (service: UsermanagementService) => {
    expect(service).toBeTruthy();
  }));
});

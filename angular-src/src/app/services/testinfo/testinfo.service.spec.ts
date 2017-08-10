import { TestBed, inject } from '@angular/core/testing';

import { TestinfoService } from './testinfo.service';

describe('TestinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestinfoService]
    });
  });

  it('should be created', inject([TestinfoService], (service: TestinfoService) => {
    expect(service).toBeTruthy();
  }));
});

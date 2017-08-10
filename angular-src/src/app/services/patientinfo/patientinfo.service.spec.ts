import { TestBed, inject } from '@angular/core/testing';

import { PatientinfoService } from './patientinfo.service';

describe('PatientinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientinfoService]
    });
  });

  it('should be created', inject([PatientinfoService], (service: PatientinfoService) => {
    expect(service).toBeTruthy();
  }));
});

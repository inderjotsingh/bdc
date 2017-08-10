import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienthistoryComponent } from './patienthistory.component';

describe('PatienthistoryComponent', () => {
  let component: PatienthistoryComponent;
  let fixture: ComponentFixture<PatienthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatienthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatienthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

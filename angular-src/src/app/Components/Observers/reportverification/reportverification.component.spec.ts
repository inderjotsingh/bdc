import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportverificationComponent } from './reportverification.component';

describe('ReportverificationComponent', () => {
  let component: ReportverificationComponent;
  let fixture: ComponentFixture<ReportverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

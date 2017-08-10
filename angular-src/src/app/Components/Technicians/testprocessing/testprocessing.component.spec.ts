import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestprocessingComponent } from './testprocessing.component';

describe('TestprocessingComponent', () => {
  let component: TestprocessingComponent;
  let fixture: ComponentFixture<TestprocessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestprocessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

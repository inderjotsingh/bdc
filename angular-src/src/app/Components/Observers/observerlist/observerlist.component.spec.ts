import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserverlistComponent } from './observerlist.component';

describe('ObserverlistComponent', () => {
  let component: ObserverlistComponent;
  let fixture: ComponentFixture<ObserverlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObserverlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObserverlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

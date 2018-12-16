import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowparamComponent } from './showparam.component';

describe('ShowparamComponent', () => {
  let component: ShowparamComponent;
  let fixture: ComponentFixture<ShowparamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowparamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowparamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Trasition2Component } from './trasition2.component';

describe('Trasition2Component', () => {
  let component: Trasition2Component;
  let fixture: ComponentFixture<Trasition2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Trasition2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Trasition2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

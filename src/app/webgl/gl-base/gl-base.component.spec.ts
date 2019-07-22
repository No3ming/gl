import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlBaseComponent } from './gl-base.component';

describe('GlBaseComponent', () => {
  let component: GlBaseComponent;
  let fixture: ComponentFixture<GlBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

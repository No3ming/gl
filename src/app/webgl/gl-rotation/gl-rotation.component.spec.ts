import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlRotationComponent } from './gl-rotation.component';

describe('GlRotationComponent', () => {
  let component: GlRotationComponent;
  let fixture: ComponentFixture<GlRotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlRotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

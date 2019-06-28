import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlMapUniformComponent } from './gl-map-uniform.component';

describe('GlMapUniformComponent', () => {
  let component: GlMapUniformComponent;
  let fixture: ComponentFixture<GlMapUniformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlMapUniformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlMapUniformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

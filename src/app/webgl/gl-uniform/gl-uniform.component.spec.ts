import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlUniformComponent } from './gl-uniform.component';

describe('GlUniformComponent', () => {
  let component: GlUniformComponent;
  let fixture: ComponentFixture<GlUniformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlUniformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlUniformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

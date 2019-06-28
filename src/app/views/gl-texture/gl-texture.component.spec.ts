import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlTextureComponent } from './gl-texture.component';

describe('GlTextureComponent', () => {
  let component: GlTextureComponent;
  let fixture: ComponentFixture<GlTextureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlTextureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlTextureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlTexture2Component } from './gl-texture2.component';

describe('GlTexture2Component', () => {
  let component: GlTexture2Component;
  let fixture: ComponentFixture<GlTexture2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlTexture2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlTexture2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

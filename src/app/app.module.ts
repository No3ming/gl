import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlBaseComponent } from './webgl/gl-base/gl-base.component';
import { GlMapUniformComponent } from './webgl/gl-map-uniform/gl-map-uniform.component';
import { GlUniformComponent } from './webgl/gl-uniform/gl-uniform.component';
import { GlTextureComponent } from './webgl/gl-texture/gl-texture.component';

import { Trasition2Component } from './webgl/trasition2/trasition2.component';
import { GlTexture2Component } from './webgl/gl-texture2/gl-texture2.component';
import { GlRotationComponent } from './webgl/gl-rotation/gl-rotation.component';

@NgModule({
  declarations: [
    AppComponent,
    GlBaseComponent,
    GlMapUniformComponent,
    GlUniformComponent,
    GlTextureComponent,
    Trasition2Component,
    GlTexture2Component,
    GlRotationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

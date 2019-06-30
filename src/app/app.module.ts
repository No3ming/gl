import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlBaseComponent } from './views/gl-base/gl-base.component';
import { GlMapUniformComponent } from './views/gl-map-uniform/gl-map-uniform.component';
import { GlUniformComponent } from './views/gl-uniform/gl-uniform.component';
import { GlTextureComponent } from './views/gl-texture/gl-texture.component';

import { Trasition2Component } from './views/trasition2/trasition2.component';
import { GlTexture2Component } from './views/gl-texture2/gl-texture2.component';

@NgModule({
  declarations: [
    AppComponent,
    GlBaseComponent,
    GlMapUniformComponent,
    GlUniformComponent,
    GlTextureComponent,
    Trasition2Component,
    GlTexture2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

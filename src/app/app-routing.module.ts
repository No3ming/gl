import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GlBaseComponent} from './views/gl-base/gl-base.component';
import {GlUniformComponent} from './views/gl-uniform/gl-uniform.component';
import {GlMapUniformComponent} from './views/gl-map-uniform/gl-map-uniform.component';
import {Trasition2Component} from './views/trasition2/trasition2.component';
import {GlTextureComponent} from './views/gl-texture/gl-texture.component';
import { GlTexture2Component } from './views/gl-texture2/gl-texture2.component';
const routes: Routes = [
  { path: 'gl-base', component: GlBaseComponent },
  { path: 'gl-uniform', component: GlUniformComponent },
  { path: 'gl-map-uniform', component: GlMapUniformComponent },
  { path: 'trasition2', component: Trasition2Component },
  { path: 'gl-texture', component: GlTextureComponent },
  { path: 'gl-texture2', component: GlTexture2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

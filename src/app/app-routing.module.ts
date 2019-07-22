import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GlBaseComponent} from './webgl/gl-base/gl-base.component';
import {GlUniformComponent} from './webgl/gl-uniform/gl-uniform.component';
import {GlMapUniformComponent} from './webgl/gl-map-uniform/gl-map-uniform.component';
import {Trasition2Component} from './webgl/trasition2/trasition2.component';
import {GlTextureComponent} from './webgl/gl-texture/gl-texture.component';
import { GlTexture2Component } from './webgl/gl-texture2/gl-texture2.component';
import {GlRotationComponent} from './webgl/gl-rotation/gl-rotation.component';
const routes: Routes = [
  { path: 'gl-base', component: GlBaseComponent },
  { path: 'gl-uniform', component: GlUniformComponent },
  { path: 'gl-map-uniform', component: GlMapUniformComponent },
  { path: 'trasition2', component: Trasition2Component },
  { path: 'gl-texture', component: GlTextureComponent },
  { path: 'gl-texture2', component: GlTexture2Component },
  { path: 'gl-rotation', component: GlRotationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

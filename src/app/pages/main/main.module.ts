import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './components/main/main.component';
import { PostsComponent } from './components/posts/posts.component';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NewPostDialogComponent } from './components/new-post-dialog/new-post-dialog.component';


@NgModule({
  declarations: [
    MainComponent,
    PostsComponent,
    NewPostDialogComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedMaterialModule
  ]
})
export class MainModule { }

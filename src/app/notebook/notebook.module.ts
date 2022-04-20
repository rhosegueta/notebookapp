import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotebookPageRoutingModule } from './notebook-routing.module';

import { NotebookPage } from './notebook.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    NotebookPageRoutingModule
  ],
  declarations: [NotebookPage]
})
export class NotebookPageModule {}

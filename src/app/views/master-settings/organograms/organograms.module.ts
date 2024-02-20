import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { OrganogramsComponent } from './organograms.component';
import { OrganogramsRoutingModule } from './organograms-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OrganogramsRoutingModule,
    BlockUIModule
  ],
  declarations: [ OrganogramsComponent ]
})
export class OrganogramsModule { }

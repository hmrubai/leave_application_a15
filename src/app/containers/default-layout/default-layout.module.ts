import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
//import { DefaultLayoutComponent } from './default-layout.component';
//import { ApplyForLeaveRoutingModule } from './apply-for-leave-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    //ApplyForLeaveRoutingModule,
    BlockUIModule
  ],
  declarations: [ 
    //DefaultLayoutComponent 
    ]
})
export class DefaultLayoutModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { SummaryLeaveRegisterComponent } from './summary-leave-register.component';
import { SummaryLeaveRegisterRoutingModule } from './summary-leave-register-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    SummaryLeaveRegisterRoutingModule,
    BlockUIModule
  ],
  declarations: [ SummaryLeaveRegisterComponent ]
})
export class SummaryLeaveRegisterModule { }

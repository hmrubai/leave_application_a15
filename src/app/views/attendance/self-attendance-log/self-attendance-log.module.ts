import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { SelfAttendanceLogComponent } from './self-attendance-log.component';
import { SelfAttendanceLogRoutingModule } from './self-attendance-log-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    SelfAttendanceLogRoutingModule,
    BlockUIModule
  ],
  declarations: [ SelfAttendanceLogComponent ]
})
export class SelfAttendanceLogModule { }

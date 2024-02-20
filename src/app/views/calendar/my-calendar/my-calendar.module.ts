import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { MyCalendarComponent } from './my-calendar.component';
import { MyCalendarRoutingModule } from './my-calendar-routing.module';
import { CommonModule } from '@angular/common';
import { NgxFullCalendarModule } from 'ngx-fullcalendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    MyCalendarRoutingModule,
    BlockUIModule,
    NgxFullCalendarModule
  ],
  declarations: [ MyCalendarComponent ]
})
export class MyCalendarModule { }

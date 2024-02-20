import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BlockUIModule } from 'ng-block-ui';
import {SharedModule} from '../../core/shared.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { NgxFullCalendarModule } from 'ngx-fullcalendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardRoutingModule,
    ChartsModule,
    BlockUIModule,
    // ButtonsModule.forRoot(),
    NgxFullCalendarModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }

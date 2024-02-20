import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardSampleComponent } from './dashboard-sample.component';
import { DashboardSampleRoutingModule } from './dashboard-sample-routing.module';

@NgModule({
  imports: [
    FormsModule,
    DashboardSampleRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ DashboardSampleComponent ]
})
export class DashboardSampleModule { }

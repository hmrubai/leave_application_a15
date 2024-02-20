import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { ChartsModule } from 'ng2-charts';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';

import { LeaveBalanceSettingsComponent } from './leave-balance-settings.component';
import { LeaveBalanceSettingsRoutingModule } from './leave-balance-settings-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    LeaveBalanceSettingsRoutingModule
  ],
  declarations: [ LeaveBalanceSettingsComponent ]
})
export class LeaveBalanceSettingsModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { EmployeePreviousLeaveBalanceListComponent } from './employee-previous-leave-balance.component';
import { EmployeePreviousLeaveBalanceListRoutingModule } from './employee-previous-leave-balance-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    EmployeePreviousLeaveBalanceListRoutingModule,
    BlockUIModule
  ],
  declarations: [ EmployeePreviousLeaveBalanceListComponent ]
})
export class EmployeePreviousLeaveBalanceListModule { }

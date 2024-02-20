import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance.component';
import { EmployeeLeaveBalanceListRoutingModule } from './employee-leave-balance-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    EmployeeLeaveBalanceListRoutingModule,
    BlockUIModule
  ],
  declarations: [ EmployeeLeaveBalanceListComponent ]
})
export class EmployeeLeaveBalanceListModule { }

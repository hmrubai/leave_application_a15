import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { MyLeaveBalanceListComponent } from './my-leave-balance.component';
import { MyLeaveBalanceListRoutingModule } from './my-leave-balance-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    MyLeaveBalanceListRoutingModule,
    BlockUIModule
  ],
  declarations: [ MyLeaveBalanceListComponent ]
})
export class MyLeaveBalanceListModule { }

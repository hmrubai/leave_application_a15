import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeePreviousLeaveBalanceListComponent } from './employee-previous-leave-balance.component';

const routes: Routes = [
  {
    path: 'employee-previous-leave-balance',
    component: EmployeePreviousLeaveBalanceListComponent,
    data: {
      title: 'Previous Leave Balance List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePreviousLeaveBalanceListRoutingModule {}

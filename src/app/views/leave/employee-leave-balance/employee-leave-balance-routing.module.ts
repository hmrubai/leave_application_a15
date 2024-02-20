import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance.component';

const routes: Routes = [
  {
    path: 'employee-leave-balance',
    component: EmployeeLeaveBalanceListComponent,
    data: {
      title: 'Leave Balance List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLeaveBalanceListRoutingModule {}

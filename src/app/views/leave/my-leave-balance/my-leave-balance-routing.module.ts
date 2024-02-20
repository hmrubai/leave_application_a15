import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLeaveBalanceListComponent } from './my-leave-balance.component';

const routes: Routes = [
  {
    path: 'my-leave-balance',
    component: MyLeaveBalanceListComponent,
    data: {
      title: 'Leave Balance List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyLeaveBalanceListRoutingModule {}

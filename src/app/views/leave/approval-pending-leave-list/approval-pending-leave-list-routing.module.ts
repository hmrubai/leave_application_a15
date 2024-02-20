import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalPendingLeaveListComponent } from './approval-pending-leave-list.component';

const routes: Routes = [
  {
    path: 'approval-pending-leave-list',
    component: ApprovalPendingLeaveListComponent,
    data: {
      title: 'Pending List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalPendingLeaveListRoutingModule {}

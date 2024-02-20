import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalApprovedLeaveListComponent } from './approval-approved-leave-list.component';

const routes: Routes = [
  {
    path: 'approval-approved-leave-list',
    component: ApprovalApprovedLeaveListComponent,
    data: {
      title: 'Approved List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalApprovedLeaveListRoutingModule {}

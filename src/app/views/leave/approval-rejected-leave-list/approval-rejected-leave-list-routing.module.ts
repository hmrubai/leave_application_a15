import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalRejectedLeaveListComponent } from './approval-rejected-leave-list.component';

const routes: Routes = [
  {
    path: 'approval-rejected-leave-list',
    component: ApprovalRejectedLeaveListComponent,
    data: {
      title: 'Rejected List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRejectedLeaveListRoutingModule {}

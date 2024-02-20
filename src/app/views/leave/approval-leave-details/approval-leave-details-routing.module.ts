import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalLeaveDetailsComponent } from './approval-leave-details.component';

const routes: Routes = [
  {
    path: 'approval-leave-details/:leave_application_id',
    component: ApprovalLeaveDetailsComponent,
    data: {
      title: 'Leave Details'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalLeaveDetailsRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalWorkFlowSetupComponent } from './approval-work-flow-setup.component';

const routes: Routes = [
  {
    path: 'approval-work-flow-setup',
    component: ApprovalWorkFlowSetupComponent,
    data: {
      title: 'Approval Work Flow Setup'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalWorkFlowSetupRoutingModule {}

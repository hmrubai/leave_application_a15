import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryLeaveRegisterComponent } from './summary-leave-register.component';

const routes: Routes = [
  {
    path: 'summary-leave-register',
    component: SummaryLeaveRegisterComponent,
    data: {
      title: 'Summary Register Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryLeaveRegisterRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavePolicyComponent } from './leave-policy.component';

const routes: Routes = [
  {
    path: 'leave-policy',
    component: LeavePolicyComponent,
    data: {
      title: 'Leave Policy Setup'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavePolicyRoutingModule {}

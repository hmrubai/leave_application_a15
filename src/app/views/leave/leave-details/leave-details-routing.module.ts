import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveDetailsComponent } from './leave-details.component';

const routes: Routes = [
  {
    path: 'leave-details/:leave_application_id',
    component: LeaveDetailsComponent,
    data: {
      title: 'Leave Details'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveDetailsRoutingModule {}

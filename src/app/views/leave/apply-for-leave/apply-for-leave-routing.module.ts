import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyForLeaveComponent } from './apply-for-leave.component';

const routes: Routes = [
  {
    path: 'apply-for-leave',
    component: ApplyForLeaveComponent,
    data: {
      title: 'Apply For A Leave'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyForLeaveRoutingModule {}

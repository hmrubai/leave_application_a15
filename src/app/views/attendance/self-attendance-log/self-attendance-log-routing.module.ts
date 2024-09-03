import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelfAttendanceLogComponent } from './self-attendance-log.component';

const routes: Routes = [
  {
    path: 'self-attendance-log',
    component: SelfAttendanceLogComponent,
    data: {
      title: 'My Attendance Log'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfAttendanceLogRoutingModule {}

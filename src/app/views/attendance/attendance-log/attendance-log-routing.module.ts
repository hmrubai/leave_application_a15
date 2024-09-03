import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceLogComponent } from './attendance-log.component';

const routes: Routes = [
  {
    path: 'attendance-log',
    component: AttendanceLogComponent,
    data: {
      title: 'Attendance Log'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceLogRoutingModule {}

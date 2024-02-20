import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkDaySetupComponent } from './work-day-setup.component';

const routes: Routes = [
  {
    path: 'work-day-setup',
    component: WorkDaySetupComponent,
    data: {
      title: 'Work Day Setup'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkDaySetupRoutingModule {}

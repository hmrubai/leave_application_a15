import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardSampleComponent } from './dashboard-sample.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardSampleComponent,
    data: {
      title: 'Dashboard Sample'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSampleRoutingModule {}

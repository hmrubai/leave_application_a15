import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayTypeComponent } from './day-type.component';

const routes: Routes = [
  {
    path: 'day-type',
    component: DayTypeComponent,
    data: {
      title: 'Day Type Setup'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DayTypeRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YearlyCalendarComponent } from './yearly-calendar.component';

const routes: Routes = [
  {
    path: 'yearly-calendar',
    component: YearlyCalendarComponent,
    data: {
      title: 'Yearly Calender'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearlyCalendarRoutingModule {}

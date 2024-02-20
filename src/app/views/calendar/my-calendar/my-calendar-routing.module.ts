import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCalendarComponent } from './my-calendar.component';

const routes: Routes = [
  {
    path: 'my-calendar',
    component: MyCalendarComponent,
    data: {
      title: 'Academic Calendar'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCalendarRoutingModule {}

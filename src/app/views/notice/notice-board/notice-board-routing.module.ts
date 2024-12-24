import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticeBoardComponent } from './notice-board.component';

const routes: Routes = [
  {
    path: 'notice',
    component: NoticeBoardComponent,
    data: {
      title: 'Notice List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeBoardRoutingModule {}

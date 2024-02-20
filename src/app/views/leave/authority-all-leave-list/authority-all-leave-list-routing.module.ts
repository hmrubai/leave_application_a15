import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorityAllLeaveListComponent } from './authority-all-leave-list.component';

const routes: Routes = [
  {
    path: 'authority-all-leave-list',
    component: AuthorityAllLeaveListComponent,
    data: {
      title: 'All Leave List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorityAllLeaveListRoutingModule {}

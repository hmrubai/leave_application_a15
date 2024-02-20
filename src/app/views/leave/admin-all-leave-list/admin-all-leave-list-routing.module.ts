import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAllLeaveListComponent } from './admin-all-leave-list.component';

const routes: Routes = [
  {
    path: 'admin-all-leave-list',
    component: AdminAllLeaveListComponent,
    data: {
      title: 'All Leave List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAllLeaveListRoutingModule {}

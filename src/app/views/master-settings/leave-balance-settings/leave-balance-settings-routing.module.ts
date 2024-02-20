import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveBalanceSettingsComponent } from './leave-balance-settings.component';

const routes: Routes = [
  {
    path: 'leave-balance-settings',
    component: LeaveBalanceSettingsComponent,
    data: {
      title: 'Leave Balance Settings'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveBalanceSettingsRoutingModule {}

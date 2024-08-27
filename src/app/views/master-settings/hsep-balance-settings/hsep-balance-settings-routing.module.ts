import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HsepBalanceSettingsComponent } from './hsep-balance-settings.component';

const routes: Routes = [
  {
    path: 'hsep-balance-settings',
    component: HsepBalanceSettingsComponent,
    data: {
      title: 'Auto Balance'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HsepBalanceSettingsRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiscalYearComponent } from './fiscal-year.component';

const routes: Routes = [
  {
    path: 'fiscal-year',
    component: FiscalYearComponent,
    data: {
      title: 'Fiscal Year'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalYearRoutingModule {}

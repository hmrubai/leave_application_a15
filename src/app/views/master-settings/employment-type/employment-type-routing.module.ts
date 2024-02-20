import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmploymentTypeComponent } from './employment-type.component';

const routes: Routes = [
  {
    path: 'employment-type',
    component: EmploymentTypeComponent,
    data: {
      title: 'Employment Type'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploymentTypeRoutingModule {}

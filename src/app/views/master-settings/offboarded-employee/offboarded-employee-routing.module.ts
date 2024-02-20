import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffboardedEmployeeComponent } from './offboarded-employee.component';

const routes: Routes = [
  {
    path: 'offboarded-employee',
    component: OffboardedEmployeeComponent,
    data: {
      title: 'Employee Informations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffboardedEmployeeRoutingModule {}

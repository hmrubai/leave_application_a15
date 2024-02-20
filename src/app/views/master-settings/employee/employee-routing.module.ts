import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee.component';

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
    data: {
      title: 'Employee Informations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {}

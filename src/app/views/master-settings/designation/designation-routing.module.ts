import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignationComponent } from './designation.component';

const routes: Routes = [
  {
    path: 'designation',
    component: DesignationComponent,
    data: {
      title: 'Designation List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationRoutingModule {}

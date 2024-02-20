import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganogramsComponent } from './organograms.component';

const routes: Routes = [
  {
    path: 'organogram',
    component: OrganogramsComponent,
    data: {
      title: 'Organogram'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganogramsRoutingModule {}

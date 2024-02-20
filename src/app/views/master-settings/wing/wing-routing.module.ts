import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WingComponent } from './wing.component';

const routes: Routes = [
  {
    path: 'wing',
    component: WingComponent,
    data: {
      title: 'Wing List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WingRoutingModule {}

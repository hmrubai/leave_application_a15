import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndividualLeaveRegisterComponent } from './individual-leave-register.component';

const routes: Routes = [
  {
    path: 'individual-leave-register',
    component: IndividualLeaveRegisterComponent,
    data: {
      title: 'Individual Leave Register Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualLeaveRegisterRoutingModule {}

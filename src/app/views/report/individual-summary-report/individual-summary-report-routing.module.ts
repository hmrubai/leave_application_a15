import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndividualSummaryReportComponent } from './individual-summary-report.component';

const routes: Routes = [
  {
    path: 'individual-summary-report',
    component: IndividualSummaryReportComponent,
    data: {
      title: 'Individual Leave Summary Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualSummaryReportRoutingModule {}

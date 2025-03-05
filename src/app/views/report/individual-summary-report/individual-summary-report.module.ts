import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { IndividualSummaryReportComponent } from './individual-summary-report.component';
import { IndividualSummaryReportRoutingModule } from './individual-summary-report-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    IndividualSummaryReportRoutingModule,
    BlockUIModule
  ],
  declarations: [ IndividualSummaryReportComponent ]
})
export class IndividualSummaryReportModule { }

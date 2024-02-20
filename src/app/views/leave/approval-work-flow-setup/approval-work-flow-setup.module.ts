import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { ApprovalWorkFlowSetupComponent } from './approval-work-flow-setup.component';
import { ApprovalWorkFlowSetupRoutingModule } from './approval-work-flow-setup-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    ApprovalWorkFlowSetupRoutingModule,
    BlockUIModule
  ],
  declarations: [ ApprovalWorkFlowSetupComponent ]
})
export class ApprovalWorkFlowSetupModule { }

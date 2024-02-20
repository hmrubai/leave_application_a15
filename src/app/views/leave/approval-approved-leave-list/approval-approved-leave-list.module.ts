import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { ApprovalApprovedLeaveListComponent } from './approval-approved-leave-list.component';
import { ApprovalApprovedLeaveListRoutingModule } from './approval-approved-leave-list-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    ApprovalApprovedLeaveListRoutingModule,
    BlockUIModule
  ],
  declarations: [ ApprovalApprovedLeaveListComponent ]
})
export class ApprovalApprovedLeaveListModule { }

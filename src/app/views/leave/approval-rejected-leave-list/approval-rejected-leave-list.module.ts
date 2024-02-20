import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { ApprovalRejectedLeaveListComponent } from './approval-rejected-leave-list.component';
import { ApprovalRejectedLeaveListRoutingModule } from './approval-rejected-leave-list-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    ApprovalRejectedLeaveListRoutingModule,
    BlockUIModule
  ],
  declarations: [ ApprovalRejectedLeaveListComponent ]
})
export class ApprovalRejectedLeaveListModule { }

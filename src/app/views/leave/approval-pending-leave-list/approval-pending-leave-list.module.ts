import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { ChartsModule } from 'ng2-charts';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { ApprovalPendingLeaveListComponent } from './approval-pending-leave-list.component';
import { ApprovalPendingLeaveListRoutingModule } from './approval-pending-leave-list-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    ApprovalPendingLeaveListRoutingModule,
    BlockUIModule
  ],
  declarations: [ ApprovalPendingLeaveListComponent ]
})
export class ApprovalPendingLeaveListModule { }

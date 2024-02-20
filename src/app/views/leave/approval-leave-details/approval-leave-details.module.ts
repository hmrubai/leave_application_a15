import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from '../../../core/shared.module';
import { ApprovalLeaveDetailsComponent } from './approval-leave-details.component';
import { ApprovalLeaveDetailsRoutingModule } from './approval-leave-details-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ApprovalLeaveDetailsRoutingModule,
    BlockUIModule,
  ],
  declarations: [ ApprovalLeaveDetailsComponent ]
})
export class ApprovalLeaveDetailsModule { }

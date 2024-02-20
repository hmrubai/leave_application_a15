import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { AdminAllLeaveListComponent } from './admin-all-leave-list.component';
import { AdminAllLeaveListRoutingModule } from './admin-all-leave-list-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    AdminAllLeaveListRoutingModule,
    BlockUIModule
  ],
  declarations: [ AdminAllLeaveListComponent ]
})
export class AdminAllLeaveListModule { }

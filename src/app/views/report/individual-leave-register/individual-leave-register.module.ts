import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { IndividualLeaveRegisterComponent } from './individual-leave-register.component';
import { IndividualLeaveRegisterRoutingModule } from './individual-leave-register-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    IndividualLeaveRegisterRoutingModule,
    BlockUIModule
  ],
  declarations: [ IndividualLeaveRegisterComponent ]
})
export class IndividualLeaveRegisterModule { }

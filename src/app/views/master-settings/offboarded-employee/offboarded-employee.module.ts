import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { OffboardedEmployeeComponent } from './offboarded-employee.component';
import { OffboardedEmployeeRoutingModule } from './offboarded-employee-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OffboardedEmployeeRoutingModule,
    NgSelectModule,
    BlockUIModule
  ],
  declarations: [ OffboardedEmployeeComponent ]
})
export class OffboardedEmployeeModule { }

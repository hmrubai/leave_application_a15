import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { LeavePolicyComponent } from './leave-policy.component';
import { LeavePolicyRoutingModule } from './leave-policy-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    LeavePolicyRoutingModule,
    BlockUIModule
  ],
  declarations: [ LeavePolicyComponent ]
})
export class LeavePolicyModule { }

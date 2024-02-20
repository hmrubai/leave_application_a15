import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../core/shared.module';
import { BlockUIModule } from 'ng-block-ui';

import { MasterLoginComponent } from './master-login.component';
import { MasterLoginRoutingModule } from './master-login-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MasterLoginRoutingModule,
    BlockUIModule
  ],
  declarations: [ MasterLoginComponent ]
})
export class MasterLoginModule { }

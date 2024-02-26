import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { ChartsModule } from 'ng2-charts';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../../core/shared.module';

import { HsepBalanceSettingsComponent } from './hsep-balance-settings.component';
import { HsepBalanceSettingsRoutingModule } from './hsep-balance-settings-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    HsepBalanceSettingsRoutingModule
  ],
  declarations: [ HsepBalanceSettingsComponent ]
})
export class HsepBalanceSettingsModule { }

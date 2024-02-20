import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { ChartsModule } from 'ng2-charts';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {SharedModule} from '../../../core/shared.module';

import { CompanyComponent } from './company.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CompanyRoutingModule
  ],
  declarations: [ CompanyComponent ]
})
export class CompanyModule { }

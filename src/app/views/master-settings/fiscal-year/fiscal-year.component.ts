import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-fiscal-year',
    templateUrl: 'fiscal-year.component.html',
    styleUrls: ['fiscal-year.component.scss']
})
export class FiscalYearComponent implements OnInit {
    @ViewChild('addFiscalYearModal') public addFiscalYearModal: ModalDirective;
    branchForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Fiscal Year';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    fiscalYearList: Array<any> = [];

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: UntypedFormBuilder,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit() {
        this.branchForm = this.formBuilder.group({
            id: [null],
            fiscal_year: [null, [Validators.required]],
            company_id: [null, [Validators.required]],
            start_date: [null, [Validators.required]],
            end_date: [null, [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getFiscalYearList()
    }

    get f() {
        return this.branchForm.controls;
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getFiscalYearList() {
        this._service.get('admin/fiscal-year-list').subscribe(res => {
            this.fiscalYearList = res.data;
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Fiscal Year';
        this.btnSaveText = 'Update';

        this.branchForm.controls['id'].setValue(item.id);
        this.branchForm.controls['fiscal_year'].setValue(item.fiscal_year);
        this.branchForm.controls['company_id'].setValue(item.company_id);
        this.branchForm.controls['start_date'].setValue(item.start_date);
        this.branchForm.controls['end_date'].setValue(item.end_date);
        this.branchForm.controls['is_active'].setValue(item.is_active);
        this.addFiscalYearModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.branchForm.invalid) {
            return;
        }

        this.branchForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/fiscal-year-save-or-update', this.branchForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getFiscalYearList();
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            }
        );
    }

    modalHide() {
        this.addFiscalYearModal.hide();
        this.branchForm.reset();
        this.submitted = false;
        this.branchForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Fiscal Year';
        this.btnSaveText = 'Save';
    }

}

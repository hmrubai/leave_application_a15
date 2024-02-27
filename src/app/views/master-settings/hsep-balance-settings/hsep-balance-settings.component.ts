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
    selector: 'app-hsep-balance-settings',
    templateUrl: 'hsep-balance-settings.component.html',
    styleUrls: ['hsep-balance-settings.component.scss']
})
export class HsepBalanceSettingsComponent implements OnInit {
    @ViewChild('addFiscalYearModal') public addFiscalYearModal: ModalDirective;
    @ViewChild('addHsepBalanceModal') public addHsepBalanceModal: ModalDirective;
    branchForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Monthly Balance';
    btnSaveText = 'Save';

    currentUser: any = null;

    balanceList: Array<any> = [];

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
        this.getBalanceHistory();
    }

    get f() {
        return this.branchForm.controls;
    }

    getBalanceHistory() {
        this.blockUI.start('Loading...')
        this._service.get('admin/hsep-balance-history').subscribe(res => {
            this.balanceList = res.data;
            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        });
    }

    addHsepBalance(){
        this.blockUI.start('Updating...')
        this._service.post('admin/add-hsep-balance', []).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getBalanceHistory();
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                    this.modalHide();
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
                this.modalHide();
            }
        );
    }

    modalHide() {
        this.addHsepBalanceModal.hide();
        this.submitted = false;
        this.modalTitle = 'Add New Monthly Balance';
        this.btnSaveText = 'Save';
    }

}

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
    selector: 'app-leave-policy',
    templateUrl: 'leave-policy.component.html',
    styleUrls: ['leave-policy.component.scss']
})
export class LeavePolicyComponent implements OnInit {
    @ViewChild('addLeavePolicyModal') public addLeavePolicyModal: ModalDirective;
    entryFrom: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Leave Policy';
    btnSaveText = 'Save';

    applicable_for_list = [
        {
            id: "Both",
            name: "Both"
        },
        {
            id: "Male",
            name: "Male"
        },
        {
            id: "Female",
            name: "Female"
        }
    ];

    currentUser: any = null;

    companyList: Array<any> = [];
    leavePolicyList: Array<any> = [];

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
        this.entryFrom = this.formBuilder.group({
            id: [null],
            leave_title: [null, [Validators.required]],
            leave_short_code: [null, [Validators.required]],
            company_id: [null, [Validators.required]],
            total_days: [0, [Validators.required]],
            is_applicable_for_all: [true],
            applicable_for: ['Both', [Validators.required]],
            is_leave_cut_applicable: [false],
            is_carry_forward: [false],
            is_document_upload: [false],
            is_holiday_deduct: [true],
            document_upload_after_days: [0],
            max_carry_forward_days: [0],
            is_active: [true]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getLeavePolicyList()
    }

    get f() {
        return this.entryFrom.controls;
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getLeavePolicyList() {
        this._service.get('admin/leave-policy-list').subscribe(res => {
            this.leavePolicyList = res.data;
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Leave Policy';
        this.btnSaveText = 'Update';

        this.entryFrom.controls['id'].setValue(item.id);
        this.entryFrom.controls['company_id'].setValue(item.company_id);
        this.entryFrom.controls['leave_title'].setValue(item.leave_title);
        this.entryFrom.controls['leave_short_code'].setValue(item.leave_short_code);
        this.entryFrom.controls['total_days'].setValue(item.total_days);
        this.entryFrom.controls['is_applicable_for_all'].setValue(item.is_applicable_for_all);
        this.entryFrom.controls['applicable_for'].setValue(item.applicable_for);
        this.entryFrom.controls['is_leave_cut_applicable'].setValue(item.is_leave_cut_applicable);
        this.entryFrom.controls['is_carry_forward'].setValue(item.is_carry_forward);
        this.entryFrom.controls['is_document_upload'].setValue(item.is_document_upload);
        this.entryFrom.controls['is_holiday_deduct'].setValue(item.is_holiday_deduct);
        this.entryFrom.controls['document_upload_after_days'].setValue(item.document_upload_after_days);
        this.entryFrom.controls['max_carry_forward_days'].setValue(item.max_carry_forward_days);
        this.entryFrom.controls['is_active'].setValue(item.is_active);
        this.addLeavePolicyModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryFrom.invalid) {
            return;
        }

        this.entryFrom.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/leave-policy-save-or-update', this.entryFrom.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getLeavePolicyList();
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
        this.addLeavePolicyModal.hide();
        this.entryFrom.reset();
        this.submitted = false;
        this.entryFrom.controls['is_applicable_for_all'].setValue(true);
        this.entryFrom.controls['is_leave_cut_applicable'].setValue(true);
        this.entryFrom.controls['is_carry_forward'].setValue(true);
        this.entryFrom.controls['is_document_upload'].setValue(true);
        this.entryFrom.controls['is_holiday_deduct'].setValue(true);
        this.entryFrom.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Leave Policy';
        this.btnSaveText = 'Save';
    }

}

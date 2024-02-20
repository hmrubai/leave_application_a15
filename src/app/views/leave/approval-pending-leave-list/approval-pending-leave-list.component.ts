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
import * as moment from 'moment';

@Component({
    selector: 'app-approval-pending-leave-list',
    templateUrl: 'approval-pending-leave-list.component.html',
    styleUrls: ['approval-pending-leave-list.component.scss']
})
export class ApprovalPendingLeaveListComponent implements OnInit {
    @ViewChild('addApplyForLeaveModal') public addApplyForLeaveModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Apply For a Leave';
    btnSaveText = 'Apply';

    day_part = [
        {
            id: 'Not Applicable',
            value: 'Not Applicable'
        },
        {
            id: '1st Half',
            value: '1st Half'
        },
        {
            id: '2nd Half',
            value: '2nd Half'
        }
    ];

    currentUser: any = null;

    companyList: Array<any> = [];
    leavePolicyList: Array<any> = [];
    applicationList: Array<any> = [];

    validity: any = null;
    is_validty_checked = false;

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
        this.entryForm = this.formBuilder.group({
            id: [null],
            leave_policy_id: [null, [Validators.required]],
            start_date: [null, [Validators.required]],
            end_date: [null, [Validators.required]],
            reason: [null, [Validators.required]],
            is_half_day: [false],
            half_day: ['Not Applicable'],
        });

        this.entryForm.controls['half_day'].disable();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getApplicationList();
        //this.getLeavePolicyList()
    }

    get f() {
        return this.entryForm.controls;
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getLeavePolicyList() {
        this._service.get('leave/user-policy-list').subscribe(res => {
            this.leavePolicyList = res.data;
        }, err => { }
        );
    }

    getApplicationList() {
        this.blockUI.start('Loading...');
        this._service.get('approval/pending/application-list').subscribe(res => {
            this.applicationList = res.data;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    changeHalfDay(){
        if(this.entryForm.value.is_half_day){
            this.entryForm.controls['half_day'].enable();
            this.changeLeaveType();
        }else{
            this.entryForm.controls['half_day'].setValue('Not Applicable');
            this.entryForm.controls['half_day'].disable();
            this.changeLeaveType();
        }
    }

    changeLeaveType(){
        if(!this.entryForm.value.start_date || !this.entryForm.value.end_date){
            this.toastr.warning('Please, select Start Date & End Date!', 'Attention!', { timeOut: 2000 });
            this.entryForm.controls['leave_policy_id'].setValue(null);
            return;
        }
        this.checkValidity();
    }

    changeDate(){
        if(this.entryForm.value.start_date && this.entryForm.value.end_date && this.entryForm.value.leave_policy_id){
            this.checkValidity();
        }
    }

    checkValidity()
    {
        this.blockUI.start('Checking...');

        if(!this.entryForm.value.leave_policy_id){
            this.toastr.warning('Please, select leave Type!', 'Attention!', { timeOut: 2000 });
            this.blockUI.stop();
            return;
        }

        let params = {
            start_date: this.validateDateTimeFormat(this.entryForm.value.start_date),
            end_date: this.validateDateTimeFormat(this.entryForm.value.end_date),
            leave_policy_id: this.entryForm.value.leave_policy_id,
            is_half_day: this.entryForm.value.is_half_day
        }

        this._service.post('leave/check-validity', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.validity = data.data;
                    this.is_validty_checked = true;

                    //this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    //this.modalHide();
                    //this.getFiscalYearList();
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

    editItem(item){
        this.modalTitle = 'Update Leave';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        // this.entryForm.controls['fiscal_year'].setValue(item.fiscal_year);
        // this.entryForm.controls['company_id'].setValue(item.company_id);
        this.entryForm.controls['start_date'].setValue(item.start_date);
        this.entryForm.controls['end_date'].setValue(item.end_date);
        this.entryForm.controls['is_half_day'].setValue(item.is_half_day);
        this.addApplyForLeaveModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Submitting...');

        if(!this.entryForm.value.leave_policy_id){
            this.toastr.warning('Please, select leave Type!', 'Attention!', { timeOut: 2000 });
            return;
        }

        this.entryForm.controls['half_day'].enable();

        let params = {
            start_date: this.validateDateTimeFormat(this.entryForm.value.start_date),
            end_date: this.validateDateTimeFormat(this.entryForm.value.end_date),
            leave_policy_id: this.entryForm.value.leave_policy_id,
            is_half_day: this.entryForm.value.is_half_day,
            half_day: this.entryForm.value.half_day,
            reason: this.entryForm.value.reason
        }

        this._service.post('leave/submit-application', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getApplicationList();
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

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    modalHide() {
        this.addApplyForLeaveModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_half_day'].setValue(true);
        this.modalTitle = 'Apply For a Leave';
        this.btnSaveText = 'Apply';
    }

}

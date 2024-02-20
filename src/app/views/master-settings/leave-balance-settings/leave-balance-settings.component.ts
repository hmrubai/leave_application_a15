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
    selector: 'app-leave-balance-settings',
    templateUrl: 'leave-balance-settings.component.html',
    styleUrls: ['leave-balance-settings.component.scss']
})
export class LeaveBalanceSettingsComponent implements OnInit {
    @ViewChild('addLeaveBalanceSettingsModal') public addLeaveBalanceSettingsModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Leave Balance';
    btnSaveText = 'Save';
    employment_type_id = null;

    currentUser: any = null;

    companyList: Array<any> = [];
    branchList: Array<any> = [];
    employmentTypeList: Array<any> = [];
    leavePolicyList: Array<any> = [];
    leaveBalanceSettingsList: Array<any> = [];
    

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
            total_days: [null, [Validators.required]],
            company_id: [null, [Validators.required]],
            employment_type_id: [null, [Validators.required]],
            leave_policy_id: [null, [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getEmploymentTypeList();
        this.getLeavePolicyList();
        this.getLeaveSettingList(0);
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

    getEmploymentTypeList(){
        this._service.get('admin/employment-type-list').subscribe(res => {
            this.employmentTypeList = res.data;
        }, err => { }
        );
    }

    getLeavePolicyList(){
        this._service.get('admin/leave-policy-list').subscribe(res => {
            this.leavePolicyList = res.data;
        }, err => { }
        );
    }

    getLeaveBalanceSettingsFilterList(){
        console.log(this.employment_type_id);
        if(this.employment_type_id){
            this.getLeaveSettingList(this.employment_type_id);
        }else{
            this.getLeaveSettingList(0);
        }
        
    }

    getLeaveSettingList(employment_type_id){
        this._service.get('admin/leave-setting-list/' + employment_type_id).subscribe(res => {
            this.leaveBalanceSettingsList = res.data;
        }, err => { }
        );
    }

    getLPListByCompanyID(company_id){
        this.leavePolicyList = [];
        this._service.get('admin/leave-policy-list-by-id/' + company_id).subscribe(res => {
            this.leavePolicyList = res.data;
        }, err => { }
        );
    }

    getBranchListByCompanyID(company_id){
        this.branchList = [];
        this._service.get('admin/branch-list-by-company-id/' + company_id).subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    onChangeCompany(company){
        this.getLPListByCompanyID(company.id);
    }

    editItem(item){
        this.modalTitle = 'Update Leave Balance';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['total_days'].setValue(item.total_days);
        this.entryForm.controls['company_id'].setValue(item.company_id);
        this.entryForm.controls['employment_type_id'].setValue(item.employment_type_id);
        this.entryForm.controls['leave_policy_id'].setValue(item.leave_policy_id);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.getLPListByCompanyID(item.company_id);
        this.addLeaveBalanceSettingsModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/leave-setting-save-or-update', this.entryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getLeaveSettingList(this.employment_type_id);
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
        this.addLeaveBalanceSettingsModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Leave Balance';
        this.btnSaveText = 'Save';
    }

}

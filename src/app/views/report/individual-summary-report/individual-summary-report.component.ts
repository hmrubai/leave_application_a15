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
    selector: 'app-individual-summary-report',
    templateUrl: 'individual-summary-report.component.html',
    styleUrls: ['individual-summary-report.component.scss']
})
export class IndividualSummaryReportComponent implements OnInit {
    @ViewChild('addApplyForLeaveModal') public addApplyForLeaveModal: ModalDirective;
    entryForm: UntypedFormGroup;
    filterForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    employee_id = null;
    department_id = null;
    start_date = null;
    end_date = null;

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

    leaveTypes = [
        { totalKey: 'sick_leave_total', consumeKey: 'sick_leave_consume', displayName: 'Sick Leave' },
        { totalKey: 'casual_leave_total', consumeKey: 'casual_leave_consume', displayName: 'Casual Leave' },
        { totalKey: 'annual_leave_total', consumeKey: 'annual_leave_consume', displayName: 'Annual Leave' },
        { totalKey: 'leave_in_lieu_total', consumeKey: 'leave_in_lieu_consume', displayName: 'Leave in Lieu' },
        { totalKey: 'paternity_leave_total', consumeKey: 'paternity_leave_consume', displayName: 'Paternity Leave' },
        { totalKey: 'wedding_leave_total', consumeKey: 'wedding_leave_consume', displayName: 'Wedding Leave' },
        { totalKey: 'home_office_total', consumeKey: 'home_office_consume', displayName: 'Home Office' }
    ];

    currentUser: any = null;

    companyList: Array<any> = [];
    employeeList: Array<any> = [];
    leavePolicyList: Array<any> = [];
    applicationList: Array<any> = [];
    individualSummaryData: Array<any> = [];
    departmentList: Array<any> = [];

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

        this.filterForm = this.formBuilder.group({
            id: [null],
            department_id: [null],
            employee_id: [null],
            start_date: [null],
            end_date: [null]
        });

        this.entryForm.controls['half_day'].disable();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getDepartmentList();
        this.getEmployeeList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get ff() {
        return this.filterForm.controls;
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getEmployeeList(){
        this._service.get('admin/employee-list').subscribe(res => {
            this.employeeList = res.data;
        }, err => { }
        );
    }

    getLeavePolicyList() {
        this._service.get('leave/user-policy-list').subscribe(res => {
            this.leavePolicyList = res.data;
        }, err => { }
        );
    }

    getDepartmentList(){
        this._service.get('admin/department-list').subscribe(res => {
            this.departmentList = res.data;
        }, err => { }
        );
    }

    onChangeEmployee(employee){
        if(employee){
            this.employee_id = employee.id;
        }else{
            this.employee_id = 0;
        }
        if(this.employee_id){
            this.filterForm.controls['employee_id'].setValue(this.employee_id);
            this.getRegisterList();
        }else{
            this.filterForm.controls['employee_id'].setValue(0);
            //this.getRegisterList();
        }
        //console.log(this.filterForm.value)
    }

    onChangeDepartment(department){
        if(department){
            this.department_id = department.id;
        }else{
            this.department_id = 0;
        }
        if(this.department_id){
            this.filterForm.controls['department_id'].setValue(this.department_id);
            this.getRegisterList();
        }else{
            this.filterForm.controls['department_id'].setValue(0);
        }
    }

    changeFilterDate(){
        if(this.start_date){
            this.filterForm.controls['start_date'].setValue(this.validateDateTimeFormat(this.start_date));
        }
        if(this.end_date){
            this.filterForm.controls['end_date'].setValue(this.validateDateTimeFormat(this.end_date));
        }
        
        if(this.start_date && this.end_date){
            this.getRegisterList();
        }
    }

    resetFilterForm(){
        this.employee_id = null;
        this.start_date = null;
        this.end_date = null;
        this.applicationList = [];
        this.filterForm.reset();
        this.getApplicationList();
    }

    getFilterList(){
        console.log(this.filterForm.value);
        this.blockUI.start('Loading...');
        this._service.post('approval/leave-application-filter', this.filterForm.value).subscribe(res => {
            this.applicationList = res.data;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    getApplicationList() {
        this.blockUI.start('Loading...');
        this._service.post('admin/individual-summary-report', this.filterForm.value).subscribe(res => {
            this.applicationList = res.data;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    getRegisterList() 
    {    
        if(!this.filterForm.value.department_id || !this.filterForm.value.start_date || !this.filterForm.value.end_date){
            return;
        }

        this.blockUI.start('Loading...');
        this._service.post('admin/individual-summary-report', this.filterForm.value).subscribe(res => {
            this.applicationList = res.data;
            this.individualSummaryData = res.data;
            this.blockUI.stop();
        }, err => { 
            
            this.toastr.error(err.message, 'Error!', { timeOut: 2000 });
            this.blockUI.stop();
        }
        );
    }

    downloadRegisterReport()
    {
        if(!this.filterForm.value.department_id || !this.filterForm.value.start_date || !this.filterForm.value.end_date){
            return;
        }

        this.blockUI.start('Generating report. Please wait...');
        this._service.downloadPostFile('admin/individual-register/download', this.filterForm.value).subscribe(res => {
            this.blockUI.stop();

            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Individual Register Report";
            link.click();
        },
        err => {
            this.toastr.warning(err.messages || err, 'Warning!');
            this.blockUI.stop();
        });
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

    hasPaternityLeave(): boolean {
        return this.individualSummaryData.some(data => data.paternity_leave_total !== undefined);
      }
      
      hasMaternityLeave(): boolean {
        return this.individualSummaryData.some(data => data.maternity_leave_total !== undefined);
      }

}

import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-approval-work-flow-setup',
    templateUrl: 'approval-work-flow-setup.component.html',
    styleUrls: ['approval-work-flow-setup.component.scss']
})
export class ApprovalWorkFlowSetupComponent implements OnInit {
    @ViewChild('updateStepModal') public updateStepModal: ModalDirective;
    @ViewChild('addStepModal') public addStepModal: ModalDirective;
    entryForm: UntypedFormGroup;
    generateCalendarForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Approval Flow';
    btnSaveText = 'Save';

    currentUser: any = null;

    year_id = null;
    number_of_step = 0;

    steps = [
        {
            id: 1,
            value: "1st"
        },
        {
            id: 2,
            value: "2nd"
        },
        {
            id: 3,
            value: "3rd"
        }
    ];

    approvalFlowList: Array<any> = [];
    employeeList: Array<any> = [];
    approvalAuthorityList: Array<any> = [];
    companyList: Array<any> = [];
    branchList: Array<any> = [];
    designationList: Array<any> = [];
    departmentList: Array<any> = [];

    company_id: any = null;
    branch_id: any = null;
    department_id: any = null;
    designation_id: any = null;
    employee_ids: any = [];
    step = null;

    employee_id = null;

    first_step = null;
    second_step = null;
    third_step = null;

    show_step = null;
    show_employee = null;


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
            employee_id: [null, [Validators.required]],
            approval_authority_id: [null, [Validators.required]],
        });

        this.generateCalendarForm = this.formBuilder.group({
            id: [null],
            academic_year: [2022, [Validators.required, Validators.max(2099), Validators.min(2020)]]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getEmployeeList();
        this.getCompanyList();
        this.getApprovalAuthorityList();
        //this.getApprovalFlowList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get gcf() {
        return this.generateCalendarForm.controls;
    }

    getApprovalFlowList() {
        

        let params = {
            employee_id: 0
        }
        if(this.employee_id){
            this.blockUI.start('Getting Data...')
            this._service.get('admin/approval-flow-list', params).subscribe(res => {
                this.approvalFlowList = res.data;
                this.blockUI.stop();
            }, err => {
                this.blockUI.stop();
            });
        }
    }

    onChangeEmployee(employee){
        if(employee){
            this.employee_id = employee.id;
        }else{
            this.employee_id = 0;
        }
        this.approvalFlowList = [];
        let params = {
            employee_id: this.employee_id
        }
        if(this.employee_id){
            this.blockUI.start('Getting Data...')
            this._service.get('admin/approval-flow-list', params).subscribe(res => {
                this.approvalFlowList = res.data;
                this.blockUI.stop();
            }, err => {
                this.blockUI.stop();
            });
        }
    }

    getEmployeeList() {
        let params = {
            company_id: this.company_id,
            branch_id: this.branch_id,
            department_id: this.department_id,
            designation_id: this.designation_id
        };

        this.employee_ids = null;

        this._service.get('admin/employee-filter-list', params).subscribe(res => {
            this.employeeList = res.data;
        }, err => { }
        );
    }

    getApprovalAuthorityList() {
        this._service.get('admin/approval-authority-list').subscribe(res => {
            this.approvalAuthorityList = res.data;
        }, err => { }
        );
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
            this.getEmployeeList();
        }, err => { }
        );
    }

    onChangeCompany(company) {
        console.log(company)
        this.branch_id = null;
        this._service.get('admin/branch-list-by-company-id/' + this.company_id).subscribe(res => {
            this.branchList = res.data;
            this.getEmployeeList();
        }, err => { }
        );
    }

    onChangeBranch(branch) {
        this.designationList = [];
        this.departmentList = [];

        this.department_id = null;
        this.designation_id = null;

        if (this.company_id && this.branch_id) {
            this._service.get('admin/department-list-by-id/' + this.company_id + '/' + this.branch_id).subscribe(res => {
                this.departmentList = res.data;
            }, err => { }
            );

            this._service.get('admin/designation-list-by-id/' + this.company_id + '/' + this.branch_id).subscribe(res => {
                this.designationList = res.data;
            }, err => { }
            );

            this.getEmployeeList();
        }
    }

    onChangeDepartment(branch) {
        this.designation_id = null;
        this.getEmployeeList();
    }

    onChangeDesignation(designation) {
        this.getEmployeeList();
    }

    onChangeStep(step) {
        if(step){
            this.number_of_step = step.id;
            if(step.id == 1){
                this.second_step = null;
                this.third_step = null;
            }
            if(step.id == 2){
                this.third_step = null;
            }
        }else{
            this.number_of_step = 0;
            this.first_step = null;
            this.second_step = null;
            this.third_step = null;
        }
    }


    onSubmitFlow() {
        if (this.employee_ids == null) {
            this.toastr.warning('Please, Select Employee!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if (this.employee_ids.length <= 0) {
            this.toastr.warning('Please, Select Employee!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if (this.number_of_step <= 0) {
            this.toastr.warning('Please, Select Step!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if(!this.first_step){
            this.toastr.warning('Please, Select 1st Step Authority!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if(this.number_of_step >= 2 && !this.second_step){
            this.toastr.warning('Please, Select 2nd Step Authority!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if(this.number_of_step >= 3 && !this.third_step){
            this.toastr.warning('Please, Select 3rd Step Authority!', 'Attention!', { timeOut: 2000 });
            return;
        }

        let params: any;
        if(this.number_of_step == 1){
            params = {
                employee_ids: this.employee_ids,
                steps: [
                    {
                        authority_id: this.first_step,
                        step_count: 1
                    }
                ]
            }
        }
        else if(this.number_of_step == 2){
            params = {
                employee_ids: this.employee_ids,
                steps: [
                    {
                        authority_id: this.first_step,
                        step_count: 1
                    },
                    {
                        authority_id: this.second_step,
                        step_count: 2
                    }
                ]
            }
        }
        else if(this.number_of_step == 3){
            params = {
                employee_ids: this.employee_ids,
                steps: [
                    {
                        authority_id: this.first_step,
                        step_count: 1
                    },
                    {
                        authority_id: this.second_step,
                        step_count: 2
                    },
                    {
                        authority_id: this.third_step,
                        step_count: 3
                    }
                ]
            }
        }

        this.blockUI.start('Saving...')
        this._service.post('admin/add-approval-flow', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getApprovalFlowList();
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

    editItem(item) {
        this.modalTitle = 'Update Step';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.show_step = item.step;
        this.show_employee = item.employee_name + ' - ' + item.employee_email;
        this.entryForm.controls['employee_id'].setValue(item.employee_id);
        this.entryForm.controls['approval_authority_id'].setValue(item.approval_authority_id);
        this.updateStepModal.show();
    }

    onFormSubmitUpdateStep(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Updating...')
        this._service.post('admin/update-approval-flow', this.entryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getApprovalFlowList();
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
        this.updateStepModal.hide();
        this.entryForm.reset();
        this.generateCalendarForm.reset();
        this.addStepModal.hide();
        this.submitted = false;
        this.modalTitle = 'Add New Year';
        this.btnSaveText = 'Save';
    }

}

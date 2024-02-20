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
    selector: 'app-department',
    templateUrl: 'department.component.html',
    styleUrls: ['department.component.scss']
})
export class DepartmentComponent implements OnInit {
    @ViewChild('addDepartmentModal') public addDepartmentModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Department';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    branchList: Array<any> = [];
    departmentList: Array<any> = [];

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
            name: [null, [Validators.required]],
            branch_id: [null, [Validators.required]],
            company_id: [null, [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getDepartmentList()
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

    getBranchListByCompanyID(company_id){
        this.branchList = [];
        this._service.get('admin/branch-list-by-company-id/' + company_id).subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    onChangeCompany(company){
        this.branchList = [];
        //this.entryForm.controls['breakdown_id'].setValue(null);
        this._service.get('admin/branch-list-by-company-id/' + company.id).subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    getDepartmentList() {
        this._service.get('admin/department-list').subscribe(res => {
            this.departmentList = res.data;
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Department';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['company_id'].setValue(item.company_id);
        this.entryForm.controls['branch_id'].setValue(item.branch_id);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.getBranchListByCompanyID(item.company_id);
        this.addDepartmentModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/department-save-or-update', this.entryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getDepartmentList();
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
        this.addDepartmentModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Department';
        this.btnSaveText = 'Save';
    }

}

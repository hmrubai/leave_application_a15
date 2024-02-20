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
    selector: 'app-wing',
    templateUrl: 'wing.component.html',
    styleUrls: ['wing.component.scss']
})
export class WingComponent implements OnInit {
    @ViewChild('addWingModal') public addWingModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Wing';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    branchList: Array<any> = [];
    wingList: Array<any> = [];

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
        this.getWingList()
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
        this._service.get('admin/branch-list-by-company-id/' + company.id).subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    getWingList() {
        this.blockUI.start('Loading...')
        this._service.get('admin/wing-list').subscribe(res => {
            this.wingList = res.data;
            this.blockUI.stop();
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Wing';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['company_id'].setValue(item.company_id);
        this.entryForm.controls['branch_id'].setValue(item.branch_id);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.getBranchListByCompanyID(item.company_id);
        this.addWingModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/wing-save-or-update', this.entryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getWingList();
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
        this.addWingModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Wing';
        this.btnSaveText = 'Save';
    }

}

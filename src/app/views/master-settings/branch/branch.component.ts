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
    selector: 'app-branch',
    templateUrl: 'branch.component.html',
    styleUrls: ['branch.component.scss']
})
export class BranchComponent implements OnInit {
    @ViewChild('addBranchModal') public addBranchModal: ModalDirective;
    branchForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Branch';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    branchList: Array<any> = [];

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
            name: [null, [Validators.required]],
            address: [null, [Validators.required]],
            contact_no: [null, [Validators.required]],
            company_id: [null, [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getBranchList()
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

    getBranchList() {
        this._service.get('admin/branch-list').subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Branch';
        this.btnSaveText = 'Update';

        this.branchForm.controls['id'].setValue(item.id);
        this.branchForm.controls['name'].setValue(item.name);
        this.branchForm.controls['address'].setValue(item.address);
        this.branchForm.controls['contact_no'].setValue(item.contact_no);
        this.branchForm.controls['company_id'].setValue(item.company_id);
        this.branchForm.controls['is_active'].setValue(item.is_active);
        this.addBranchModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.branchForm.invalid) {
            return;
        }

        this.branchForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/branch-save-or-update', this.branchForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getBranchList();
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
        this.addBranchModal.hide();
        this.branchForm.reset();
        this.submitted = false;
        this.branchForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Branch';
        this.btnSaveText = 'Save';
    }

}

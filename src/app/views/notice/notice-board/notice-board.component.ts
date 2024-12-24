import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ConfirmService } from '../../../_helpers/confirm-dialog/confirm.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-notice-board',
    templateUrl: 'notice-board.component.html',
    styleUrls: ['notice-board.component.scss']
})
export class NoticeBoardComponent implements OnInit {
    @ViewChild('addNoticeModal') public addNoticeModal: ModalDirective;
    branchForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Notice';
    btnSaveText = 'Save';

    currentUser: any = null;

    priorityList = [
        {
            id : "High",
            value : "High"
        },
        {
            id : "Medium",
            value : "Medium"
        },
        {
            id : "Low",
            value : "Low"
        }
    ]

    companyList: Array<any> = [];
    branchList: Array<any> = [];

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: UntypedFormBuilder,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmService: ConfirmService,
    ) {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit() {
        this.branchForm = this.formBuilder.group({
            id: [null],
            title: [null, [Validators.required]],
            description: [null, [Validators.required]],
            notice_type: ["Low", [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.getCompanyList();
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
        this._service.get('admin/notice-list').subscribe(res => {
            this.branchList = res.data;
        }, err => { }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Notice';
        this.btnSaveText = 'Update';

        this.branchForm.controls['id'].setValue(item.id);
        this.branchForm.controls['title'].setValue(item.title);
        this.branchForm.controls['description'].setValue(item.description);
        this.branchForm.controls['notice_type'].setValue(item.notice_type);
        this.branchForm.controls['is_active'].setValue(item.is_active);
        this.addNoticeModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.branchForm.invalid) {
            return;
        }

        this.branchForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/notice-save-or-update', this.branchForm.value).subscribe(
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

    deleteNotice(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.')
        .subscribe(
            result => {
                if (result) {
                    this._service.post('admin/notice-delete', { id : item.id }).subscribe(
                        data => {
                            console.log(item)
                            this.blockUI.stop();
                            this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                            this.getBranchList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    modalHide() {
        this.addNoticeModal.hide();
        this.branchForm.reset();
        this.submitted = false;
        this.branchForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Notice';
        this.btnSaveText = 'Save';
    }

}

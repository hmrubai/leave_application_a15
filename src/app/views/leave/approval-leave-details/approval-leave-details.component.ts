import { Component, ViewEncapsulation, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-approval-leave-details',
    templateUrl: 'approval-leave-details.component.html',
    styleUrls: ['approval-leave-details.component.scss']
})
export class ApprovalLeaveDetailsComponent implements OnInit {
    @ViewChild('approvalModal') public approvalModal: ModalDirective;
    @ViewChild('viewExplanationModal') public viewExplanationModal: ModalDirective;
    modalRef?: BsModalRef;
    modalConfig = {
        class: 'modal-dialog-centered modal-sm'
    }
    modalConfigMd = {
        class: 'modal-dialog-centered modal-md'
    }
    entryForm: UntypedFormGroup;
    uploadForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;
    leave_application_id;

    modalTitle = 'Do you want to approve?';
    btnSaveText = 'Approve';  
    user_role = null; 
    rejection_cause = null; 

    urls = [];
    files = [];

    profile_image = "assets/img/avatars/profile.png"

    currentUser: any = null;

    companyList: Array<any> = [];
    leaveDetails: Array<any> = [];
    explanationList: Array<any> = [];

    leave_count_on_this_day = 0;
    is_loaded = false;
    is_approval_permit = false;

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: UntypedFormBuilder,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: BsModalService
    ) {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }

        this.currentUser = this.authService.currentUserDetails.value;
        this.user_role = this.currentUser.user_type;

        if(this.user_role == 'Employee'){
            this.toastr.error('You are not the authorized person to access this page!', 'Attention!', { timeOut: 3000 });
            this.router.navigate(['/dashboard']);
        }

        this.leave_application_id = this.route.snapshot.paramMap.get("leave_application_id");
    }

    ngOnInit() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required]],
            address: [null, [Validators.required]],
            contact_no: [null, [Validators.required]],
            company_email: [null, [Validators.required]],
            hr_email: [null, [Validators.required]],
            leave_email: [null, [Validators.required]],
            company_logo: [null],
            employee_code_length: [null],
            company_prefix: [null],
            is_active: [true],
        });

        this.uploadForm = this.formBuilder.group({
            image_file: ['']
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getLeaveDetails();
    }

    get f() {
        return this.entryForm.controls;
    }

    onSelectFile(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadForm.get('image_file').setValue(this.files);
            }
        }
    }

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getLeaveDetails() {
        this.blockUI.start('Fetching...')
        this._service.get('leave/application-details-by-id/' + this.leave_application_id).subscribe(res => {
            this.leaveDetails = res.data;
            this.leave_count_on_this_day = res.data.leave_count_on_this_day;
            if(res.data.employee.image){
                this.profile_image = environment.imageURL + res.data.employee.image;
            }

            res.data.leave_flow.forEach(item => {
                if(item.step_flag == "Active" && item.approval_user_id == this.currentUser.id){
                    this.is_approval_permit = true;
                }
            });

            this.is_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    openApproveModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfig);
    }

    approveApplication(){
        console.log("Approved")

        let params = {
            leave_application_id: this.leave_application_id
        }

        this.blockUI.start('Approving...')
        this._service.post('leave/approve-leave', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalClose();
                    this.router.navigate(['/dashboard']);
                    //this.router.navigate(['/leave/approval-approved-leave-list'])
                    //this.getLeaveDetails();
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            }
        );
        this.modalRef?.hide();
    }

    openRejectModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigMd);
    }

    rejectApplication(){
        let params = {
            leave_application_id: this.leave_application_id,
            rejection_cause: this.rejection_cause
        }

        this.blockUI.start('Rejecting...')
        this._service.post('leave/reject-leave', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.error(data.message, 'Success!', { timeOut: 2000 });
                    this.modalClose();
                    this.router.navigate(['/dashboard']);
                    //this.router.navigate(['/leave/approval-approved-leave-list'])
                    //this.getLeaveDetails();
                } else {
                    this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
            }
        );
        this.modalRef?.hide();
    }

    viewExplanation(cutting_explanation){
        this.explanationList = [];
        this.explanationList = cutting_explanation;
        this.modalTitle = 'Leave Cutting Explanation';
        this.btnSaveText = 'Save';
        this.viewExplanationModal.show();
    }

    explanationModalHide(){
        this.viewExplanationModal.hide();
    }

    decline(){
        this.modalRef?.hide();
    }

    modalClose(){
        this.modalRef?.hide();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        const formData = new FormData();
        if(this.uploadForm.get('image_file').value){
            formData.append('file', this.uploadForm.get('image_file').value);
        }

        formData.append('name', this.entryForm.value.name.trim());
        formData.append('address', this.entryForm.value.address.trim());
        formData.append('contact_no', this.entryForm.value.contact_no.trim());
        formData.append('company_email', this.entryForm.value.company_email.trim());
        formData.append('hr_email', this.entryForm.value.hr_email.trim());
        formData.append('leave_email', this.entryForm.value.leave_email.trim());
        formData.append('employee_code_length', this.entryForm.value.employee_code_length);
        formData.append('company_prefix', this.entryForm.value.company_prefix ? this.entryForm.value.company_prefix.trim() : null);
        formData.append('is_active', this.entryForm.value.is_active);

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');
        if(this.entryForm.value.id){
            formData.append('id', this.entryForm.value.id);
        }

        this._service.post('admin/company-save-or-update', formData).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getCompanyList();
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

    backTo() {
        this.location.back();
    }

    modalHide() {
        this.approvalModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Company';
        this.btnSaveText = 'Save';
    }

}

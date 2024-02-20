import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ConfirmService } from '../../../_helpers/confirm-dialog/confirm.service';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';

@Component({
    selector: 'app-leave-details',
    templateUrl: 'leave-details.component.html',
    styleUrls: ['leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {
    @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
    @ViewChild('viewExplanationModal') public viewExplanationModal: ModalDirective;
    entryForm: UntypedFormGroup;
    uploadForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;
    leave_application_id;

    modalTitle = 'Add New Category';
    btnSaveText = 'Save';    

    urls = [];
    files = [];

    profile_image = "assets/img/avatars/profile.png"

    currentUser: any = null;

    companyList: Array<any> = [];
    leaveDetails: Array<any> = [];
    explanationList: Array<any> = [];

    is_loaded = false;
    is_withdrawable = true;

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: UntypedFormBuilder,
        private authService: AuthenticationService,
        private confirmService: ConfirmService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }else{
            this.currentUser = this.authService.currentUserDetails.value;
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
            let employee_id = res.data.employee.id;

            if(!employee_id){
                this.toastr.error('What are you looking for? We are tracking your activities!', 'Attention!', { timeOut: 3000 });
                this.router.navigate(['/leave/apply-for-leave']);
            }

            if(employee_id != this.currentUser.id){
                this.toastr.error('You are not able to check others\' leave details', 'Attention!', { timeOut: 3000 });
                this.router.navigate(['/leave/apply-for-leave']);
            }

            if(res.data.employee.image){
                this.profile_image = environment.imageURL + res.data.employee.image;
            }

            res.data.leave_flow.forEach(element => {
                if(element.approval_status != 'Pending'){
                    this.is_withdrawable = false;
                }
            });

            this.is_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    editItem(item){
        this.modalTitle = 'Update Company';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['address'].setValue(item.address);
        this.entryForm.controls['contact_no'].setValue(item.contact_no);
        this.entryForm.controls['company_email'].setValue(item.company_email);
        this.entryForm.controls['hr_email'].setValue(item.hr_email);
        this.entryForm.controls['leave_email'].setValue(item.leave_email);
        //this.entryForm.controls['company_logo'].setValue(item.company_logo);
        this.entryForm.controls['employee_code_length'].setValue(item.employee_code_length);
        this.entryForm.controls['company_prefix'].setValue(item.company_prefix);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.addCompanyModal.show();
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

    withdrawApplication(){
        let params = {
            leave_application_id: this.leave_application_id
        }

        if (!this.is_withdrawable){
            this.toastr.error('You can\'t modify this leave application! Already approved seen by your Supervisor!', 'Opps!', { timeOut: 3000 });
            return;
        }

        this.confirmService.confirm('Are you sure?', 'Do you want to withdraw application?')
        .subscribe(
        result => {
            if (result) {
                this.blockUI.start('Updating...');
                this._service.post('leave/withdraw-leave', params).subscribe(res => {
                    this.toastr.success(res.message, 'Successful!');
                    this.getLeaveDetails();
                    this.blockUI.stop();
                }, err => {
                    this.blockUI.stop();
                });
            }
        }
        );
    }

    backTo() {
        this.location.back();
    }

    modalHide() {
        this.addCompanyModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Company';
        this.btnSaveText = 'Save';
    }

}

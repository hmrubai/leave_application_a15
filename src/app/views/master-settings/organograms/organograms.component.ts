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
    selector: 'app-organograms',
    templateUrl: 'organograms.component.html',
    styleUrls: ['organograms.component.scss']
})
export class OrganogramsComponent implements OnInit {
    @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
    entryForm: UntypedFormGroup;
    uploadForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Category';
    btnSaveText = 'Save';    

    urls = [];
    files = [];

    currentUser: any = null;

    companyList: Array<any> = [];

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
        //this.getCompanyList();
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

    modalHide() {
        this.addCompanyModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Company';
        this.btnSaveText = 'Save';
    }

}

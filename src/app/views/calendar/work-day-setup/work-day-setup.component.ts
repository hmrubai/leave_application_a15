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
    selector: 'app-work-day-setup',
    templateUrl: 'work-day-setup.component.html',
    styleUrls: ['work-day-setup.component.scss']
})
export class WorkDaySetupComponent implements OnInit {
    @ViewChild('addWorkDaySetupModal') public addWorkDaySetupModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Employment Type';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    workDayList: Array<any> = [];
    dayTypeList: Array<any> = [];

    edit_object = {
        id: 0,
        saturday: 0,
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0
    }
    

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
            saturday: [null, [Validators.required]],
            sunday: [null, [Validators.required]],
            monday: [null, [Validators.required]],
            tuesday: [null, [Validators.required]],
            wednesday: [null, [Validators.required]],
            thursday: [null, [Validators.required]],
            friday: [null, [Validators.required]],
            is_active: [true],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getWorkDayList();
        this.getDayTypeList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getWorkDayList() {
        this._service.get('admin/day-status-list').subscribe(res => {
            this.workDayList = res.data;
            this.edit_object.id = res.data.id;
            this.edit_object.saturday = res.data.saturday;
            this.edit_object.sunday = res.data.sunday;
            this.edit_object.monday = res.data.monday;
            this.edit_object.tuesday = res.data.tuesday;
            this.edit_object.wednesday = res.data.wednesday;
            this.edit_object.thursday = res.data.thursday;
            this.edit_object.friday = res.data.friday;
        }, err => { }
        );
    }

    getDayTypeList() {
        this._service.get('admin/day-type-list').subscribe(res => {
            this.dayTypeList = res.data;
        }, err => { }
        );
    }

    editItem(){
        this.modalTitle = 'Update Day Status';
        this.btnSaveText = 'Update';

        let item = this.edit_object;

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['saturday'].setValue(item.saturday);
        this.entryForm.controls['sunday'].setValue(item.sunday);
        this.entryForm.controls['monday'].setValue(item.monday);
        this.entryForm.controls['tuesday'].setValue(item.tuesday);
        this.entryForm.controls['wednesday'].setValue(item.wednesday);
        this.entryForm.controls['thursday'].setValue(item.thursday);
        this.entryForm.controls['friday'].setValue(item.friday);
        this.entryForm.controls['is_active'].setValue(true);
        this.addWorkDaySetupModal.show();
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        console.log(this.entryForm.value);

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/update-day-status', this.entryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getWorkDayList();
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
        this.addWorkDaySetupModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Update Day Status';
        this.btnSaveText = 'Save';
    }
}

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
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
    selector: 'app-attendance-log',
    templateUrl: 'attendance-log.component.html',
    styleUrls: ['attendance-log.component.scss']
})
export class AttendanceLogComponent implements OnInit {
    @ViewChild('addFiscalYearModal') public addFiscalYearModal: ModalDirective;
    branchForm: UntypedFormGroup;
    filterForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    punchData: any[] = [];

    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    start_grace_time = null;
    end_grace_time = null;
    employee_id = null;
    start_date = null;
    end_date = null;

    grace_time = [
        {
            id: "00:00:00",
            value: "00:00:00"
        },
        {
            id: "00:05:00",
            value: "00:05:00"
        },
        {
            id: "00:10:00",
            value: "00:10:00"
        },
        {
            id: "00:15:00",
            value: "00:15:00"
        },
        {
            id: "00:20:00",
            value: "00:20:00"
        },
        {
            id: "00:25:00",
            value: "00:25:00"
        },
        {
            id: "00:30:00",
            value: "00:30:00"
        }
    ]

    modalTitle = 'Upload Attendance Log';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    employeeList: Array<any> = [];
    fiscalYearList: Array<any> = [];
    attendanceList: Array<any> = [];

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
            start_date: [null, [Validators.required]]
        });

        this.filterForm = this.formBuilder.group({
            employee_id: [null],
            start_date: [null],
            end_date: [null],
            start_grace_time: [null],
            end_grace_time: [null],
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //this.getCompanyList();
        //this.getFiscalYearList();
        this.getEmployeeList();
    }

    get f() {
        return this.branchForm.controls;
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

    getFiscalYearList() {
        this._service.get('admin/fiscal-year-list').subscribe(res => {
            this.fiscalYearList = res.data;
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
            if(this.start_date && this.end_date){
                this.getFilterList();
            }
        }else{
            this.filterForm.controls['employee_id'].setValue(0);
            //this.getApplicationList();
        }
        //console.log(this.filterForm.value)
    }

    changeFilterDate(){
        if(this.start_date){
            this.filterForm.controls['start_date'].setValue(this.validateDateTimeFormat(this.start_date));
        }
        if(this.end_date){
            this.filterForm.controls['end_date'].setValue(this.validateDateTimeFormat(this.end_date));
        }
        
        if(this.start_date && this.end_date){
            this.getFilterList();
        }else{
            //this.getApplicationList();
        }
    }

    getFilterList(){
        if (!this.employee_id) {
            this.toastr.warning('Please, Select stuff!', 'Attention!', { timeOut: 2000 });
            return;
        }

        if(this.start_date){
            this.filterForm.controls['start_date'].setValue(this.validateDateTimeFormat(this.start_date));
        }
        if(this.end_date){
            this.filterForm.controls['end_date'].setValue(this.validateDateTimeFormat(this.end_date));
        }
        
        if(!this.start_date || !this.end_date){
            this.toastr.warning('Please, Select Date!', 'Attention!', { timeOut: 2000 });
            return;
        }

        this.filterForm.controls['start_grace_time'].setValue(this.start_grace_time);
        this.filterForm.controls['end_grace_time'].setValue(this.end_grace_time);

        this.blockUI.start('Loading...');
        this._service.post('admin/attendance-log', this.filterForm.value).subscribe(res => {
            this.attendanceList = res.data;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
            this.toastr.error(err.message, 'Attention!', { timeOut: 2000 });
        }
        );
    }

    addfile(event) {
        this.file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.importedData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            this.dataImported = true;
            this.filelist = this.file;
            console.log(this.importedData)

            this.punchData = this.importedData.map(item => ({
                employee_id: item["Employee ID"],
                punch_date: this.formatDateToISO(item.Date),
                punch_time: item.Time
            }));

            console.log(this.punchData)
        }
    }

    formatDateToISO(dateStr) {
        let dateParts;
        let date;
        
        if (dateStr.includes('/')) {
            dateParts = dateStr.split('/').map(Number);
            const [day, month, year] = dateParts;
            date = new Date(Date.UTC(2000 + year, month - 1, day));
        } 

        else if (dateStr.includes('-')) {
            dateParts = dateStr.split('-').map(Number);
            const [day, month, year] = dateParts;
            date = new Date(Date.UTC(year, month - 1, day));
        }
        
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date.toISOString().slice(0, 10);
        } else {
            return null;
        }
    }

    submitPunchLog(){
        if (this.punchData.length === 0) {
            this.toastr.error('No data found to upload.', 'Error!', { timeOut: 2000 });
            return;
        }

        this.blockUI.start('Uploading...');

        this._service.post('admin/upload-attendance-log', { data: this.punchData }).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.punchData = [];
                    //this.submitted = false;
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

    onFormSubmit(){
        this.submitted = true;
        if (this.branchForm.invalid) {
            return;
        }

        this.branchForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/fiscal-year-save-or-update', this.branchForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getFiscalYearList();
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
        this.addFiscalYearModal.hide();
        this.branchForm.reset();
        this.submitted = false;
        // this.branchForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Upload Attendance Log';
        this.btnSaveText = 'Save';
    }

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

}

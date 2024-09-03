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

@Component({
    selector: 'app-attendance-log',
    templateUrl: 'attendance-log.component.html',
    styleUrls: ['attendance-log.component.scss']
})
export class AttendanceLogComponent implements OnInit {
    @ViewChild('addFiscalYearModal') public addFiscalYearModal: ModalDirective;
    branchForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    punchData: any[] = [];

    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    modalTitle = 'Upload Attendance Log';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    fiscalYearList: Array<any> = [];

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
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //this.getCompanyList();
        //this.getFiscalYearList()
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

    getFiscalYearList() {
        this._service.get('admin/fiscal-year-list').subscribe(res => {
            this.fiscalYearList = res.data;
        }, err => { }
        );
    }

    // editItem(item){
    //     this.modalTitle = 'Update Fiscal Year';
    //     this.btnSaveText = 'Update';

    //     this.branchForm.controls['id'].setValue(item.id);
    //     this.branchForm.controls['fiscal_year'].setValue(item.fiscal_year);
    //     this.branchForm.controls['company_id'].setValue(item.company_id);
    //     this.branchForm.controls['start_date'].setValue(item.start_date);
    //     this.branchForm.controls['end_date'].setValue(item.end_date);
    //     this.branchForm.controls['is_active'].setValue(item.is_active);
    //     this.addFiscalYearModal.show();
    // }

    onFileChange(event: any): void {
        console.log(event)
        const target: DataTransfer = <DataTransfer>(event.target);

        if (target.files.length !== 1) {
            console.log("No data Found");
          throw new Error('Cannot use multiple files');
        }

        const reader: FileReader = new FileReader();
        
        reader.onload = (event: any) => {
            console.log("No data Found", reader);
          const binaryStr: string = event.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName: string = workbook.SheetNames[0];
          const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
          this.punchData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON
          console.log(this.punchData); // Display the parsed data
        };

        console.log(this.punchData);
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

}

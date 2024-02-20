import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { FullCalendarOptions, EventObject, FullCalendarComponent } from 'ngx-fullcalendar';

import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-calendar',
    templateUrl: 'my-calendar.component.html',
    styleUrls: ['my-calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
    @ViewChild('addEmployeeLeaveBalanceModal') public addEmployeeLeaveBalanceModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    options: FullCalendarOptions;
    events: EventObject[];
    @ViewChild('theCalendar') theCalendar: FullCalendarComponent;

    modalTitle = 'Add New Leave Balance';
    btnSaveText = 'Save';
    employee_id = null;

    currentUser: any = null;

    employeeList: Array<any> = [];
    applicationList: Array<any> = [];
    is_calender_loaded = false;

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
        this.is_calender_loaded = true;
        this.options = {
            defaultDate: new Date(),
            editable: true,    
        };

        this.entryForm = this.formBuilder.group({
            id: [null],
            total_days: [null, [Validators.required]],
            availed_days: [null, [Validators.required]],
            remaining_days: [null, [Validators.required]],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCalendarSummary();
    }

    get f() {
        return this.entryForm.controls;
    }

    getCalendarSummary(){
        this.blockUI.start('Loading...');
        this._service.get('my/calendar-list').subscribe(res => {
            this.applicationList = res.data.leave_list;

            this.applicationList.forEach(item => {
                if(item.leave_status == "Approved"){
                    let event_data = { id: item.id, title: item.leave_title, allDay: true, start: item.start_date, end: item.end_date, backgroundColor: '#4caf50', borderColor: '#4caf50', textColor: '#fff' };
                    this.theCalendar.calendar.addEvent(event_data);
                }
                if(item.leave_status == "Rejected"){
                    let event_data = { id: item.id, title: item.leave_title, allDay: true, start: item.start_date, end: item.end_date, backgroundColor: '#f86c6b', borderColor: '#f86c6b', textColor: '#fff' };
                    this.theCalendar.calendar.addEvent(event_data);
                }
            });

            res.data.weekend_holiday.forEach(day => {
                let note = '';
                if(day.day_note){
                    note = ' | ' + day.day_note
                    let event_data = { id: 'cd' + day.id, title: day.day_type_title + note, allDay: true, start: day.date, end: day.date, backgroundColor: '#00bcd4', borderColor: '#00bcd4', textColor: '#000' };
                    this.theCalendar.calendar.addEvent(event_data);
                }else{
                    let event_data = { id: 'cd' + day.id, title: day.day_type_title, allDay: true, start: day.date, end: day.date, backgroundColor: '#ffc107', borderColor: '#ffc107', textColor: '#000' };
                    this.theCalendar.calendar.addEvent(event_data);
                }
                
                
            });

            this.theCalendar.calendar.render();
            this.is_calender_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        });
    }

    modalHide() {
        this.addEmployeeLeaveBalanceModal.hide();
        this.entryForm.reset();
        this.submitted = false;
        // this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Leave Balance';
        this.btnSaveText = 'Save';
    }

}

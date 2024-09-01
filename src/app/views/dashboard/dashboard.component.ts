import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FullCalendarOptions, EventObject, FullCalendarComponent } from 'ngx-fullcalendar';

@Component({
    selector: 'app-main-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    LoginForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    options: FullCalendarOptions;
    events: EventObject[];
    @ViewChild('theCalendar') theCalendar: FullCalendarComponent;

    dashboard: any = null;
    currentUser: any = null;
    public user_role = null;

    leaveBalanceList: Array<any> = [];
    applicationList: Array<any> = [];
    subordinateApplicationList: Array<any> = [];
    subordinateSummary: Array<any> = [];
    is_loaded = false;
    is_calender_loaded = false;
    is_list_loaded = false;
    is_subordinate_summary_loaded = false;

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

        this.currentUser = this.authService.currentUserDetails.value;
        this.user_role = this.currentUser.user_type;
    }

    ngOnInit() {

        this.is_calender_loaded = true;
        this.options = {
            defaultDate: new Date(),
            editable: true,    
        };
        
        this.LoginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.getDashboardSummary();

        if(this.user_role != 'Employee'){
            this.getSubordinateApplicationList();
            this.getSubordinateSummary();
        } 
    }

    get f() {
        return this.LoginForm.controls;
    }

    getDashboardSummary(){
        this.blockUI.start('Loading...');
        this._service.get('dashboard-summary').subscribe(res => {
            this.dashboard = res.data;
            this.leaveBalanceList = res.data.balance_list;
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
                    let event_data = { id: 'cd' + day.id, title: day.day_type_title + note, allDay: true, start: day.date, end: day.date, backgroundColor: '#1c2e71', borderColor: '#1c2e71', textColor: '#fff' };
                    this.theCalendar.calendar.addEvent(event_data);
                }else{
                    let event_data = { id: 'cd' + day.id, title: day.day_type_title, allDay: true, start: day.date, end: day.date, backgroundColor: '#1c2e71', borderColor: '#1c2e71', textColor: '#fff' };
                    this.theCalendar.calendar.addEvent(event_data);
                }
            });

            this.theCalendar.calendar.render();
            this.is_calender_loaded = true;

            this.is_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        });
    }

    getSubordinateApplicationList() {
        //this.blockUI.start('Loading...');
        this._service.get('approval/pending/application-list').subscribe(res => {
            this.subordinateApplicationList = res.data;
            this.is_list_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    getSubordinateSummary() {
        //this.blockUI.start('Loading...');
        this._service.get('approval-dashboard-summary').subscribe(res => {
            this.subordinateSummary = res.data;
            console.log(res.data)
            this.is_subordinate_summary_loaded = true;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    // lineChart1
    public lineChart1Data: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Series A'
        }
    ];
    public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart1Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 40 - 5,
                    max: 84 + 5,
                }
            }],
        },
        elements: {
            line: {
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart1Colours: Array<any> = [
        {
            backgroundColor: getStyle('--primary'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart1Legend = false;
    public lineChart1Type = 'line';

    // lineChart2
    public lineChart2Data: Array<any> = [
        {
            data: [1, 18, 9, 17, 34, 22, 11],
            label: 'Series A'
        }
    ];
    public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart2Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 1 - 5,
                    max: 34 + 5,
                }
            }],
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart2Colours: Array<any> = [
        { // grey
            backgroundColor: getStyle('--info'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart2Legend = false;
    public lineChart2Type = 'line';


    // lineChart3
    public lineChart3Data: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'Series A'
        }
    ];
    public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart3Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart3Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
        }
    ];
    public lineChart3Legend = false;
    public lineChart3Type = 'line';


    // barChart1
    public barChart1Data: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
            label: 'Series A',
            barPercentage: 0.6,
        }
    ];
    public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    public barChart1Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        }
    };
    public barChart1Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.3)',
            borderWidth: 0
        }
    ];
    public barChart1Legend = false;
    public barChart1Type = 'bar';

}

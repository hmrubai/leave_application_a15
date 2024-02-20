import { Component, ViewEncapsulation, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@Component({
    selector: 'app-offboarded-employee',
    templateUrl: 'offboarded-employee.component.html',
    styleUrls: ['offboarded-employee.component.scss']
})
export class OffboardedEmployeeComponent implements OnInit {
    
    returnUrl: string; 
    profile_image = "assets/img/avatars/profile.png";
    view_profile_image = "assets/img/avatars/profile.png";

    search_field = null;

    currentUser: any = null;

    employeeList: Array<any> = [];
    allEmployeeList: Array<any> = [];

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private _service: CommonService,
        public formBuilder: UntypedFormBuilder,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService
    ) {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit() {

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getEmployeeList();
    }

    getEmployeeList() {
        this.blockUI.start('Loading...')
        this._service.get('admin/offboarded-employee-list').subscribe(res => {
            this.employeeList = res.data;

            res.data.forEach(item => {
                if(item.image){
                    item.profile_image = environment.imageURL + item.image;
                }else{
                    item.profile_image = this.profile_image;
                }
            });
            this.allEmployeeList = this.employeeList;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        });
    }

    searchField(search){
        if(search.length){
            let newList = [];
            this.employeeList.forEach(employee => {
                let search_text = search.toLowerCase();
                let employee_name = employee.name.toLowerCase();
                let employee_code = employee.employee_code.toLowerCase();
                let employee_mobile = employee.mobile.toLowerCase();

                let is_exist = false;
                if(employee_name.indexOf(search_text) !== -1){
                    is_exist = true;
                }
                if(employee_code.indexOf(search_text) !== -1){
                    is_exist = true;
                }
                if(employee_mobile.indexOf(search_text) !== -1){
                    is_exist = true;
                }

                if(is_exist){
                    newList.push(employee);
                }
            });
            this.employeeList = newList;
        }else{
            this.employeeList = this.allEmployeeList;
        }
    }

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    getDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DD');
    }

    getDateFormat(value: Date) {
        return moment(value).format('DD/MM/yyyy');
    }
}

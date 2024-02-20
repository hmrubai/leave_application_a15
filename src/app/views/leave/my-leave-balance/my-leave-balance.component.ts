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
    selector: 'app-my-leave-balance',
    templateUrl: 'my-leave-balance.component.html',
    styleUrls: ['my-leave-balance.component.scss']
})
export class MyLeaveBalanceListComponent implements OnInit {
    @ViewChild('addEmployeeLeaveBalanceModal') public addEmployeeLeaveBalanceModal: ModalDirective;
    @ViewChild('viewExplanationModal') public viewExplanationModal: ModalDirective;
    entryForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Leave Balance';
    btnSaveText = 'Save';
    employee_id = null;

    currentUser: any = null;

    employeeList: Array<any> = [];
    leaveBalanceList: Array<any> = [];
    explanationList: Array<any> = [];

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
            total_days: [null, [Validators.required]],
            availed_days: [null, [Validators.required]],
            remaining_days: [null, [Validators.required]],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getLeaveBalanceList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getLeaveBalanceList(){
        this.blockUI.start('Loading...');
        this._service.get('my/leave-balance-list').subscribe(res => {
            this.leaveBalanceList = res.data.balance_list;
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

}

import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { CommonService } from '../../../_services/common.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { MustMatch } from '../../../_helpers/must-match.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-change-password',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('addChangePasswordModal') public addChangePasswordModal: ModalDirective;
    passwordForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Fiscal Year';
    btnSaveText = 'Save';

    currentUser: any = null;

    companyList: Array<any> = [];
    ChangePasswordList: Array<any> = [];

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
        this.passwordForm = this.formBuilder.group({
            old_password: [null, [Validators.required]],
            new_password: [null, [Validators.required]],
            confirm_password: [null, [Validators.required]]
        }, {
            validator: MustMatch('new_password', 'confirm_password')
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f() {
        return this.passwordForm.controls;
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.passwordForm.invalid) {
            console.log(this.passwordForm)
            return;
        }

        this.passwordForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('auth/change-password', this.passwordForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.userLogout();
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
        this.addChangePasswordModal.hide();
        this.passwordForm.reset();
        this.submitted = false;
        this.passwordForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Fiscal Year';
        this.btnSaveText = 'Save';
    }

    userLogout() {
        this.authService.logout(window.location.hostname);
        Cookie.delete('.BBLEAVEMS.Cookie', '/', window.location.hostname);
        this.authService.currentUserDetails.next(null);
        this.router.navigate(['/login']);
    }

}

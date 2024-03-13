import { Component, ViewEncapsulation, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
    selector: 'app-employee',
    templateUrl: 'employee.component.html',
    styleUrls: ['employee.component.scss']
})
export class EmployeeComponent implements OnInit {
    @ViewChild('addEmployeeLeaveBalanceModal') public addEmployeeLeaveBalanceModal: ModalDirective;
    @ViewChild('addEmployeeModal') public addEmployeeModal: ModalDirective;
    @ViewChild('editEmployeeModal') public editEmployeeModal: ModalDirective;
    @ViewChild('employeeDetailsModal') public employeeDetailsModal: ModalDirective;
    @ViewChild('addChangePasswordModal') public addChangePasswordModal: ModalDirective;
    @ViewChild('viewExplanationModal') public viewExplanationModal: ModalDirective;

    modalRef?: BsModalRef;
    modalConfig = {
        class: 'modal-dialog-centered modal-sm'
    }
    modalConfigMd = {
        class: 'modal-dialog-centered modal-md'
    }
    modalConfigLg = {
        class: 'modal-dialog-centered modal-lg'
    }
    balanceEntryForm: UntypedFormGroup;
    entryForm: UntypedFormGroup;
    passwordResetForm: UntypedFormGroup;
    uploadForm: UntypedFormGroup;
    submitted = false;
    returnUrl: string;

    modalTitle = 'Add New Employee';
    btnSaveText = 'Save'; 
    profile_image = "assets/img/avatars/profile.png";
    view_profile_image = "assets/img/avatars/profile.png";

    search_field = null;
    is_balance_loaded = false;

    urls = [];
    files = [];

    currentUser: any = null;

    bloodGroup = [
        {
            id: "A+",
            value: "A+"
        },{
            id: "A-",
            value: "A-"
        },{
            id: "B+",
            value: "B+"
        },{
            id: "B-",
            value: "B-"
        },{
            id: "O+",
            value: "O+"
        },{
            id: "O-",
            value: "O-"
        },{
            id: "AB+",
            value: "AB+"
        },{
            id: "AB-",
            value: "AB-"
        }
    ]

    maritalStatus = [
        {
            id: "Married",
            value: "Married"
        },
        {
            id: "Unmarried",
            value: "Unmarried"
        },
        {
            id: "Divorced",
            value: "Divorced"
        }
        
    ]

    gender = [
        {
            id: "Male",
            value: "Male"
        },
        {
            id: "Female",
            value: "Female"
        },
        {
            id: "Transgender",
            value: "Transgender"
        } 
    ]

    user_types = [
        {
            id: "Admin",
            value: "Admin"
        },
        {
            id: "Employee",
            value: "Employee"
        },
        {
            id: "ApprovalAuthority",
            value: "ApprovalAuthority"
        },
        {
            id: "Others",
            value: "Others"
        } 
    ]

    employeeList: Array<any> = [];
    allEmployeeList: Array<any> = [];
    companyList: Array<any> = [];
    branchList: Array<any> = [];
    designationList: Array<any> = [];
    wingList: Array<any> = [];
    departmentList: Array<any> = [];
    employmentList: Array<any> = [];
    divisionList: Array<any> = [];
    districtList: Array<any> = [];
    upazilaList: Array<any> = [];
    unionList: Array<any> = [];
    leaveBalanceList: Array<any> = [];
    explanationList: Array<any> = [];

    offboarding_date = null;
    offboard_employee: any = null;
    employee_details: any = null;
    is_details = false;

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
        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required]],
            father_name: [null],
            mother_name: [null],
            employee_id: [null, [Validators.required]],
            email: [null, [Validators.required]],
            mobile: [null, [Validators.required]],
            nid: [null],
            company_id: [null, [Validators.required]],
            branch_id: [null, [Validators.required]],
            present_address: [null],
            permanent_address: [null],
            date_of_birth: [null],
            joining_date: [null, [Validators.required]],
            blood_group: [null],
            marital_status: [null],
            gender: [null, [Validators.required]],
            department_id: [null, [Validators.required]],
            designation_id: [null, [Validators.required]],
            //wing: [null],
            wing_id: [null],
            is_hsep: [false],
            employment_type_id: [null, [Validators.required]],
            division_id: [null],
            district_id: [null],
            city_id: [null],
            area_id: [null],
            is_stuckoff: [null],
            stuckoff_date: [null],
            office_contact_number: [null],
            finger_print_id: [null],
            personal_alt_contact_number: [null],
            personal_email: [null],
            passport_number: [null],
            spouse_name: [null],
            spouse_number: [null],
            fathers_contact_number: [null],
            mothers_contact_number: [null],
            referee_office: [null],
            referee_relative: [null],
            referee_contact_details: [null],
            key_skills: [null],
            highest_level_of_study: [null],
            user_type: ['Employee', [Validators.required] ],
            e_tin: [null],
            applicable_tax_amount: [null],
            official_achievement: [null],
            remarks: [null],
            is_active: [true],
            image: [null]
        });

        this.balanceEntryForm = this.formBuilder.group({
            id: [null],
            total_cutting_days: [null, [Validators.required]],
            remaining_days: [null, [Validators.required]],
            note: [null, [Validators.required]],
        });

        this.passwordResetForm = this.formBuilder.group({
            user_id: [null, [Validators.required]],
            new_password: [null, [Validators.required]]
        });

        this.uploadForm = this.formBuilder.group({
            image_file: ['']
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.getCompanyList();
        this.getEmployeeList();
        this.getDivisonList();
        this.getEmploymentList();
    }

    get f() {
        return this.entryForm.controls;
    }

    get rf() {
        return this.passwordResetForm.controls;
    }
    
    get lf() {
        return this.balanceEntryForm.controls;
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

    getEmployeeList() {
        this.blockUI.start('Loading...')
        this._service.get('admin/employee-list').subscribe(res => {
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

    getCompanyList() {
        this._service.get('admin/company-list').subscribe(res => {
            this.companyList = res.data;
        }, err => { }
        );
    }

    getDivisonList() {
        this._service.get('division-list').subscribe(res => {
            this.divisionList = res.data;
        }, err => { }
        );
    }

    getEmploymentList(){
        this.blockUI.start('Loading...')
        this._service.get('admin/employment-type-list').subscribe(res => {
            this.employmentList = res.data;



            this.blockUI.stop();
        }, err => {
            this.blockUI.stop();
        });
    }

    onChangeDivision(division){
        this.districtList = [];
        this.entryForm.controls['district_id'].setValue(null);
        this.entryForm.controls['city_id'].setValue(null);
        this.entryForm.controls['area_id'].setValue(null);
        this._service.get('district-list/' + division.id).subscribe(res => {
            this.districtList = res.data;
        }, err => { }
        );
    }

    onChangeDistrict(district){
        this.upazilaList = [];
        this.entryForm.controls['city_id'].setValue(null);
        this.entryForm.controls['area_id'].setValue(null);
        this._service.get('upazila-list/' + district.id).subscribe(res => {
            this.upazilaList = res.data;
        }, err => { }
        );
    }

    onChangeUpazila(upazila){
        this.unionList = [];
        this.entryForm.controls['area_id'].setValue(null);
        this._service.get('area-list/' + upazila.id).subscribe(res => {
            this.unionList = res.data;
        }, err => { }
        );
    }

    onChangeCompany(company){
        this.branchList = [];
        this.onChangeBranchOrCompany();
        this._service.get('admin/branch-list-by-company-id/' + company.id).subscribe(res => {
            this.branchList = res.data;
            this.blockUI.stop();
        }, err => { 
            this.blockUI.stop();
        }
        );
    }

    onChangeBranchOrCompany(){
        let comapny_id = this.entryForm.value.company_id;
        let branch_id = this.entryForm.value.branch_id;

        this.entryForm.controls['department_id'].setValue(null);
        this.entryForm.controls['designation_id'].setValue(null);

        this.designationList = [];
        this.departmentList = [];
        this.wingList = [];

        this.blockUI.start('Loading...')
        if(comapny_id && branch_id){
            this._service.get('admin/department-list-by-id/' + comapny_id + '/' + branch_id).subscribe(res => {
                this.departmentList = res.data;
                this.blockUI.stop();
            }, err => { 
                this.blockUI.stop();
            }
            );

            this._service.get('admin/designation-list-by-id/' + comapny_id + '/' + branch_id).subscribe(res => {
                this.designationList = res.data;
                this.blockUI.stop();
            }, err => { 
                this.blockUI.stop();
            }
            );

            this._service.get('admin/wing-list-by-id/' + comapny_id + '/' + branch_id).subscribe(res => {
                this.wingList = res.data;
                this.blockUI.stop();
            }, err => { 
                this.blockUI.stop();
            }
            );
        }
    }

    editItem(item){
        this.modalTitle = 'Update Employee';
        this.btnSaveText = 'Update';

        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['father_name'].setValue(item.father_name);
        this.entryForm.controls['mother_name'].setValue(item.mother_name);
        this.entryForm.controls['fathers_contact_number'].setValue(item.fathers_contact_number);
        this.entryForm.controls['mothers_contact_number'].setValue(item.mothers_contact_number);
        this.entryForm.controls['employee_id'].setValue(item.employee_id);
        this.entryForm.controls['email'].setValue(item.email);
        this.entryForm.controls['email'].disable();
        this.entryForm.controls['mobile'].setValue(item.mobile);
        this.entryForm.controls['nid'].setValue(item.nid);
        this.entryForm.controls['present_address'].setValue(item.present_address);
        this.entryForm.controls['permanent_address'].setValue(item.permanent_address);
        this.entryForm.controls['date_of_birth'].setValue(this.getDateFormatModal(item.date_of_birth));
        this.entryForm.controls['joining_date'].setValue(this.getDateFormatModal(item.joining_date));
        this.entryForm.controls['blood_group'].setValue(item.blood_group);
        this.entryForm.controls['marital_status'].setValue(item.marital_status);
        this.entryForm.controls['gender'].setValue(item.gender);
        this.entryForm.controls['company_id'].setValue(item.company_id);
        this.onChangeCompany({id: item.company_id});

        this.entryForm.controls['branch_id'].setValue(item.branch_id);
        this.onChangeBranchOrCompany();

        this.entryForm.controls['department_id'].setValue(item.department_id);
        this.entryForm.controls['designation_id'].setValue(item.designation_id);
        this.entryForm.controls['wing_id'].setValue(item.wing_id);
        this.entryForm.controls['is_hsep'].setValue(item.is_hsep);

        this.entryForm.controls['employment_type_id'].setValue(item.employment_type_id);
        this.entryForm.controls['division_id'].setValue(item.division_id);
        this.onChangeDivision({id: item.division_id});

        this.entryForm.controls['district_id'].setValue(item.district_id);
        this.onChangeDistrict({id: item.district_id});

        this.entryForm.controls['city_id'].setValue(item.city_id);
        this.onChangeUpazila({id: item.city_id});

        this.entryForm.controls['area_id'].setValue(item.area_id);
        this.entryForm.controls['is_stuckoff'].setValue(item.is_stuckoff);
        this.entryForm.controls['stuckoff_date'].setValue(item.stuckoff_date);
        this.entryForm.controls['office_contact_number'].setValue(item.office_contact_number);
        this.entryForm.controls['office_contact_number'].setValue(item.office_contact_number);
        this.entryForm.controls['finger_print_id'].setValue(item.finger_print_id);
        this.entryForm.controls['personal_alt_contact_number'].setValue(item.personal_alt_contact_number);
        this.entryForm.controls['personal_email'].setValue(item.personal_email);
        this.entryForm.controls['passport_number'].setValue(item.passport_number);
        this.entryForm.controls['spouse_name'].setValue(item.spouse_name);
        this.entryForm.controls['spouse_number'].setValue(item.spouse_number);
        this.entryForm.controls['referee_office'].setValue(item.referee_office);
        this.entryForm.controls['referee_relative'].setValue(item.referee_relative);
        this.entryForm.controls['referee_contact_details'].setValue(item.referee_contact_details);
        this.entryForm.controls['key_skills'].setValue(item.key_skills);
        this.entryForm.controls['highest_level_of_study'].setValue(item.highest_level_of_study);
        this.entryForm.controls['e_tin'].setValue(item.e_tin);
        this.entryForm.controls['applicable_tax_amount'].setValue(item.applicable_tax_amount);
        this.entryForm.controls['official_achievement'].setValue(item.official_achievement);
        this.entryForm.controls['remarks'].setValue(item.remarks);
        //this.entryForm.controls['image'].setValue(item.image);
        this.entryForm.controls['user_type'].setValue(item.user_type);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.entryForm.controls['is_hsep'].setValue(item.is_hsep);
        if(item.image){
            this.view_profile_image = environment.imageURL + item.image;
        }else{
            this.view_profile_image = "assets/img/avatars/profile.png";
        }
        this.editEmployeeModal.show();
    }

    openDetailsModal(item){
        this.modalTitle = 'Employee Details';
        this.employee_details = item;
        this.is_details = true;
        this.getEmployeeLeaveBalance(item.id)
        this.employeeDetailsModal.show();
    }

    getEmployeeLeaveBalance(id){
        this.leaveBalanceList = [];
        this._service.get('admin/leave-balance-list/' + id).subscribe(res => {
            this.leaveBalanceList = res.data.balance_list;
            this.is_balance_loaded = true;
        }, err => { }
        );
    }

    editLeaveBalanceItem(item){
        this.modalTitle = 'Cut Leave Balance';
        this.btnSaveText = 'Cut';
        this.balanceEntryForm.controls['id'].setValue(item.id);
        this.balanceEntryForm.controls['total_cutting_days'].setValue(1);
        this.balanceEntryForm.controls['remaining_days'].setValue(item.remaining_days);
        this.addEmployeeLeaveBalanceModal.show();
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

    onLeaveBalanceFormSubmit(){
        this.submitted = true;
        if (this.balanceEntryForm.invalid) {
            return;
        }

        let total_cutting_days = this.balanceEntryForm.value.total_cutting_days;
        let availed_days = this.balanceEntryForm.value.availed_days;
        let remaining_days = this.balanceEntryForm.value.remaining_days;
        if(total_cutting_days > remaining_days){
            this.toastr.warning("Please, enter correct value", 'Attention!', { timeOut: 2000 });
            return;
        }

        console.log(this.balanceEntryForm.value)

        this.balanceEntryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');

        this._service.post('admin/cut-leave-balance', this.balanceEntryForm.value).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
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
        if (this.entryForm.invalid) {
            return;
        }

        const formData = new FormData();
        if(this.uploadForm.get('image_file').value){
            formData.append('image', this.uploadForm.get('image_file').value);
        }

        this.entryForm.controls['email'].enable();

        formData.append('name', this.entryForm.value.name.trim());
        formData.append('father_name', this.entryForm.value.father_name ? this.entryForm.value.father_name.trim() : '');
        formData.append('mother_name', this.entryForm.value.mother_name ? this.entryForm.value.mother_name.trim() : '');
        formData.append('fathers_contact_number', this.entryForm.value.fathers_contact_number ? this.entryForm.value.fathers_contact_number.trim() : '');
        formData.append('mothers_contact_number', this.entryForm.value.mothers_contact_number ? this.entryForm.value.mothers_contact_number.trim() : '');
        formData.append('email', this.entryForm.value.email.trim());
        formData.append('employee_id', this.entryForm.value.employee_id);
        formData.append('mobile', this.entryForm.value.mobile ? this.entryForm.value.mobile.trim() : '');
        formData.append('nid', this.entryForm.value.nid ? this.entryForm.value.nid.trim() : '');
        formData.append('present_address', this.entryForm.value.present_address ? this.entryForm.value.present_address.trim() : '');
        formData.append('permanent_address', this.entryForm.value.permanent_address ? this.entryForm.value.permanent_address.trim() : '');
        formData.append('office_contact_number', this.entryForm.value.office_contact_number ? this.entryForm.value.office_contact_number.trim() : '');
        formData.append('finger_print_id', this.entryForm.value.finger_print_id ? this.entryForm.value.finger_print_id.trim() : '');
        formData.append('personal_alt_contact_number', this.entryForm.value.personal_alt_contact_number ? this.entryForm.value.personal_alt_contact_number.trim() : '');
        formData.append('personal_email', this.entryForm.value.personal_email ? this.entryForm.value.personal_email.trim() : '');
        formData.append('passport_number', this.entryForm.value.passport_number ? this.entryForm.value.passport_number.trim() : '');
        formData.append('spouse_name', this.entryForm.value.spouse_name ? this.entryForm.value.spouse_name.trim() : '');
        formData.append('spouse_number', this.entryForm.value.spouse_number ? this.entryForm.value.spouse_number.trim() : '');
        formData.append('referee_office', this.entryForm.value.referee_office ? this.entryForm.value.referee_office.trim() : '');
        formData.append('referee_relative', this.entryForm.value.referee_relative ? this.entryForm.value.referee_relative.trim() : '');
        formData.append('referee_contact_details', this.entryForm.value.referee_contact_details ? this.entryForm.value.referee_contact_details.trim() : '');
        formData.append('key_skills', this.entryForm.value.key_skills ? this.entryForm.value.key_skills.trim() : '');
        formData.append('highest_level_of_study', this.entryForm.value.highest_level_of_study ? this.entryForm.value.highest_level_of_study.trim() : '');
        formData.append('e_tin', this.entryForm.value.e_tin ? this.entryForm.value.e_tin.trim() : '');
        formData.append('applicable_tax_amount', this.entryForm.value.applicable_tax_amount ? this.entryForm.value.applicable_tax_amount.trim() : '');
        formData.append('official_achievement', this.entryForm.value.official_achievement ? this.entryForm.value.official_achievement.trim() : '');
        formData.append('remarks', this.entryForm.value.remarks ? this.entryForm.value.remarks.trim() : '');
        if(this.entryForm.value.date_of_birth){
            formData.append('date_of_birth', this.validateDateTimeFormat(this.entryForm.value.date_of_birth));
        }else{
            formData.append('date_of_birth', null);
        }
        formData.append('joining_date', this.validateDateTimeFormat(this.entryForm.value.joining_date));
        formData.append('blood_group', this.entryForm.value.blood_group);
        formData.append('marital_status', this.entryForm.value.marital_status);
        formData.append('gender', this.entryForm.value.gender);
        formData.append('company_id', this.entryForm.value.company_id);
        formData.append('branch_id', this.entryForm.value.branch_id);
        formData.append('department_id', this.entryForm.value.department_id);
        formData.append('designation_id', this.entryForm.value.designation_id);
        //formData.append('wing', this.entryForm.value.wing);
        formData.append('wing_id', this.entryForm.value.wing_id);
        formData.append('is_hsep', this.entryForm.value.is_hsep);
        formData.append('employment_type_id', this.entryForm.value.employment_type_id);
        formData.append('division_id', this.entryForm.value.division_id);
        formData.append('district_id', this.entryForm.value.district_id);
        formData.append('city_id', this.entryForm.value.city_id);
        formData.append('area_id', this.entryForm.value.area_id);
        formData.append('is_stuckoff', this.entryForm.value.is_stuckoff);
        formData.append('stuckoff_date', this.entryForm.value.stuckoff_date);
        formData.append('user_type', this.entryForm.value.user_type);
        formData.append('is_active', this.entryForm.value.is_active);

        this.entryForm.value.id ? this.blockUI.start('Saving...') : this.blockUI.start('Updating...');
        if(this.entryForm.value.id){
            formData.append('id', this.entryForm.value.id);
            this._service.post('admin/update-employee', formData).subscribe(
                data => {
                    this.blockUI.stop();
                    if (data.status) {
                        this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                        this.modalHide();
                        this.getEmployeeList();
                    } else {
                        this.toastr.error(data.message, 'Error!', { timeOut: 2000 });
                    }
                },
                err => {
                    this.blockUI.stop();
                    this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
                }
            );
        }else{
            this._service.post('admin/add-employee', formData).subscribe(
                data => {
                    this.blockUI.stop();
                    if (data.status) {
                        this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                        this.modalHide();
                        this.getEmployeeList();
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
    }

    openChangePasswordModal(employee) {
        this.modalTitle = 'Password Reset';
        this.btnSaveText = "Update Password";
        this.passwordResetForm.controls['user_id'].setValue(employee.id);
        this.addChangePasswordModal.show();
    }

    onResetFormSubmit(){
        this.submitted = true;
        if (this.passwordResetForm.invalid) {
            return;
        }
        let params = {
            user_id: this.passwordResetForm.value.user_id,
            new_password: this.passwordResetForm.value.new_password
        };

        this.blockUI.start('Updating...')
        this._service.post('auth/update-password', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.modalHide();
                    this.getEmployeeList();
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

    openOffboardModal(employee, template: TemplateRef<any>) {
        this.offboard_employee = employee;
        this.modalRef = this.modalService.show(template, this.modalConfigMd);
    }

    offboardSubmission(){
        if(!this.offboarding_date){
            this.toastr.error("Please, enter offboarding date!", 'Attention!', { timeOut: 2000 });
            return;
        }

        let params = {
            employee_id: this.offboard_employee.id,
            offboarding_date: this.validateDateTimeFormat(this.offboarding_date)
        }

        this.blockUI.start('Offboarding...')
        this._service.post('admin/make-employee-offboarded', params).subscribe(
            data => {
                this.blockUI.stop();
                if (data.status) {
                    this.toastr.success(data.message, 'Success!', { timeOut: 2000 });
                    this.closeModal();
                    this.getEmployeeList();
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

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    getDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DD');
    }

    getDateFormat(value: Date) {
        return moment(value).format('DD/MM/yyyy');
    }

    closeModal(){
        this.modalRef?.hide();
        this.offboard_employee = {};
    }

    modalHide() {
        this.addEmployeeModal.hide();
        this.editEmployeeModal.hide();
        this.employeeDetailsModal.hide();
        this.entryForm.reset();
        this.uploadForm.reset();
        this.passwordResetForm.reset();
        this.addChangePasswordModal.hide();
        this.addEmployeeLeaveBalanceModal.hide();
        this.balanceEntryForm.reset();
        this.view_profile_image = "assets/img/avatars/profile.png";
        this.submitted = false;
        this.entryForm.controls['email'].enable();
        this.entryForm.controls['is_active'].setValue(true);
        this.modalTitle = 'Add New Employee';
        this.btnSaveText = 'Save';
        this.employee_details = {};
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { navItems } from '../../_nav';
import { AuthenticationService } from '../../_services/authentication.service';
import { environment } from '../../../environments/environment';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
    @ViewChild('LeavePolicyModal') public LeavePolicyModal: ModalDirective;
    public sidebarMinimized = false;
    public allNavItems = navItems;

    modalTitle = 'Leave Policy';
    btnSaveText = 'Close';

    public user_role = null;

    public currentUser: any = {};

    reloadSubscription: any;

    profile_image = 'assets/img/avatars/profile.png'

    public navItems = [];

    constructor(
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router,
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
        this.user_role = this.currentUser.user_type;

        if (this.currentUser.image) {
            this.profile_image = environment.imageURL + this.currentUser.image
        }
    }

    ngOnInit(): void {
        this.CheckPermission()
    }

    CheckPermission() {
        this.allNavItems.forEach(menu => {
            if (!menu.title) {
                if (menu.children) {
                    let new_child = [];
                    if (menu.children.length) {
                        menu.children.forEach((item, index) => {
                            let is_exist = false;
                            if (item.role) {
                                let role = item.role ? item.role.split(',') : null;
                                let is_exist = role.includes(this.user_role);
                                if (is_exist) {
                                    new_child.push(item)
                                }
                            }
                        });
                    }
                    menu.children = new_child;
                }
            }
        });
        this.navItems = this.removeItemsWithoutChildren(this.allNavItems);
        let dash_item = {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer',
            badge: {
                variant: 'info',
                text: ''
            }
        }

        this.navItems.unshift(dash_item);
        //console.log(this.navItems);
    }

    removeItemsWithoutChildren(menu) {
        return menu
            .map((item) => {
                if (item.children && item.children.length > 0 && item.name === 'Dashboard') {
                    //console.log(item.children.length);
                    //item.children = this.removeItemsWithoutChildren(item.children);
                }
                return item;
            })
            .filter((item) => item.children && item.children.length > 0 && item.name !== 'Dashboard');
    }

    toggleMinimize(e) {
        this.sidebarMinimized = e;
    }

    gotoChangePassword(){
        console.log("goto change password");
        this.router.navigate(['/login/change-password']);
        console.log("goto change password");
    }

    userLogout() {
        this.authService.logout(window.location.hostname);
        Cookie.delete('.BBLEAVEMS.Cookie', '/', window.location.hostname);
        this.authService.currentUserDetails.next(null);
        this.toastr.success('Logout Successfully', 'Success!', { timeOut: 2000 });
        this.router.navigate(['/login']).then(() => {
            window.location.reload();
        });
        ///this.router.navigate(["/login"]);
    }

    modalHide() {
        this.LeavePolicyModal.hide();
        this.modalTitle = 'Leave Policy';
        this.btnSaveText = 'Close';
    }

}

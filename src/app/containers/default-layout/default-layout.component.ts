import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { navItems } from '../../_nav';
import { AuthenticationService } from '../../_services/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
    public sidebarMinimized = false;
    public allNavItems = navItems;

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
        this.navItems = this.allNavItems;
    }

    toggleMinimize(e) {
        this.sidebarMinimized = e;
    }

    userLogout() {
        this.authService.logout(window.location.hostname);
        Cookie.delete('.BBLEAVEMS.Cookie', '/', window.location.hostname);
        this.authService.currentUserDetails.next(null);
        this.router.navigate(['/login']);
        this.toastr.success('Logout Successfully', 'Success!', { timeOut: 2000 });
        this.router.navigate(["/login"]);
    }

}

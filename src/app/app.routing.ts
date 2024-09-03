import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { MasterLoginComponent } from './views/master-login/master-login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './_helpers/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: MasterLoginComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/master-login/master-login.module').then(m => m.MasterLoginModule)
      }
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/company/company.module').then(m => m.CompanyModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/branch/branch.module').then(m => m.BranchModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/designation/designation.module').then(m => m.DesignationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/wing/wing.module').then(m => m.WingModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/department/department.module').then(m => m.DepartmentModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/fiscal-year/fiscal-year.module').then(m => m.FiscalYearModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/leave-policy/leave-policy.module').then(m => m.LeavePolicyModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/employment-type/employment-type.module').then(m => m.EmploymentTypeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/leave-balance-settings/leave-balance-settings.module').then(m => m.LeaveBalanceSettingsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/employee/employee.module').then(m => m.EmployeeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/offboarded-employee/offboarded-employee.module').then(m => m.OffboardedEmployeeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/organograms/organograms.module').then(m => m.OrganogramsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'master-settings',
        loadChildren: () => import('./views/master-settings/change-password/change-password.module').then(m => m.ChangePasswordModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'attendance',
        loadChildren: () => import('./views/attendance/attendance-log/attendance-log.module').then(m => m.AttendanceLogModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'attendance',
        loadChildren: () => import('./views/attendance/self-attendance-log/self-attendance-log.module').then(m => m.SelfAttendanceLogModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/master-settings/hsep-balance-settings/hsep-balance-settings.module').then(m => m.HsepBalanceSettingsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/employee-leave-balance/employee-leave-balance.module').then(m => m.EmployeeLeaveBalanceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/employee-previous-leave-balance/employee-previous-leave-balance.module').then(m => m.EmployeePreviousLeaveBalanceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/my-leave-balance/my-leave-balance.module').then(m => m.MyLeaveBalanceListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/approval-work-flow-setup/approval-work-flow-setup.module').then(m => m.ApprovalWorkFlowSetupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/apply-for-leave/apply-for-leave.module').then(m => m.ApplyForLeaveModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/approval-pending-leave-list/approval-pending-leave-list.module').then(m => m.ApprovalPendingLeaveListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/approval-approved-leave-list/approval-approved-leave-list.module').then(m => m.ApprovalApprovedLeaveListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/approval-rejected-leave-list/approval-rejected-leave-list.module').then(m => m.ApprovalRejectedLeaveListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/admin-all-leave-list/admin-all-leave-list.module').then(m => m.AdminAllLeaveListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/authority-all-leave-list/authority-all-leave-list.module').then(m => m.AuthorityAllLeaveListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/leave-details/leave-details.module').then(m => m.LeaveDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave/approval-leave-details/approval-leave-details.module').then(m => m.ApprovalLeaveDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/calendar/day-type/day-type.module').then(m => m.DayTypeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/calendar/work-day-setup/work-day-setup.module').then(m => m.WorkDaySetupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/calendar/my-calendar/my-calendar.module').then(m => m.MyCalendarModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/calendar/yearly-calendar/yearly-calendar.module').then(m => m.YearlyCalendarModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      }
      
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

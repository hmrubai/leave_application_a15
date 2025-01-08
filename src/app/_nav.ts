import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: {
            variant: 'info',
            text: ''
        }
    },
    // {
    //     title: true,
    //     name: 'System Settings'
    // },
    {
        name: 'Settings',
        url: '/master-settings',
        icon: 'icon-settings',
        children: [
            {
                name: 'Company Information',
                url: '/master-settings/company',
                icon: 'icon-notebook',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Fiscal Year',
                url: '/master-settings/fiscal-year',
                icon: 'icon-event',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Branch',
                url: '/master-settings/branch',
                icon: 'icon-organization',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Department',
                url: '/master-settings/department',
                icon: 'icon-layers',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Designation',
                url: '/master-settings/designation',
                icon: 'icon-badge',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Wing',
                url: '/master-settings/wing',
                icon: 'icon-badge',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Employment Type',
                url: '/master-settings/employment-type',
                icon: 'icon-grid',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Employee',
                url: '/master-settings/employee',
                icon: 'icon-user',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Offboarded Employee',
                url: '/master-settings/offboarded-employee',
                icon: 'icon-user',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Leave Policy',
                url: '/master-settings/leave-policy',
                icon: 'icon-book-open',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Balance Settings',
                url: '/master-settings/leave-balance-settings',
                icon: 'icon-chart',
                role: 'Admin,SuperAdministrator'
            },
            // {
            //     name: 'Organogram',
            //     url: '/master-settings/organogram',
            //     icon: 'icon-organization',
            //     role: 'Admin,Employee,ApprovalAuthority'
            // }
        ]
    },
    // {
    //     title: true,
    //     name: 'Calendar'
    // },
    {
        name: 'Attendance',
        url: '/attendance',
        icon: 'icon-event',
        children: [
            {
                name: 'Attendance Log',
                url: '/attendance/attendance-log',
                icon: 'icon-event',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'My Timesheet',
                url: '/attendance/self-attendance-log',
                icon: 'icon-list',
                role: 'Admin,SuperAdministrator,Employee,ApprovalAuthority'
            }
        ]
    },
    {
        name: 'Notice',
        url: '/notice',
        icon: 'icon-event',
        children: [
            {
                name: 'Notice Board',
                url: '/notice/notice',
                icon: 'icon-event',
                role: 'Admin,SuperAdministrator,ApprovalAuthority'
            }
        ]
    },
    {
        name: 'Calendar',
        url: '/calendar',
        icon: 'icon-calendar',
        children: [
            {
                name: 'Day Type Setup',
                url: '/calendar/day-type',
                icon: 'icon-settings',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Working Day Setup',
                url: '/calendar/work-day-setup',
                icon: 'icon-settings',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Calendar Setup',
                url: '/calendar/yearly-calendar',
                icon: 'icon-calendar',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Academic Calendar',
                url: '/calendar/my-calendar',
                icon: 'icon-calendar',
                role: 'Admin,SuperAdministrator,Employee,ApprovalAuthority'
            }
        ]
    },
    // {
    //     title: true,
    //     name: 'Balance'
    // },
    {
        name: 'Balance',
        url: '/balance',
        icon: 'icon-layers',
        children: [
            {
                name: 'My Leave Balance',
                url: '/balance/my-leave-balance',
                icon: 'icon-wallet',
                role: 'Admin,SuperAdministrator,Employee,ApprovalAuthority'
            },
            {
                name: 'Balance Setup',
                url: '/balance/employee-leave-balance',
                icon: 'icon-wallet',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Previous Balance',
                url: '/balance/employee-previous-leave-balance',
                icon: 'icon-wallet',
                role: 'Admin,SuperAdministrator'
            },
            {
                name: 'Auto Balance Add',
                url: '/balance/hsep-balance-settings',
                icon: 'icon-wallet',
                role: 'Admin,SuperAdministrator'
            }
        ]
    },
    // {
    //     title: true,
    //     name: 'Leave'
    // },
    {
        name: 'Leave Application',
        url: '/leave',
        icon: 'icon-directions',
        children: [
            {
                name: 'My Leave',
                url: '/leave/apply-for-leave',
                icon: 'icon-share-alt',
                role: 'Admin,SuperAdministrator,Employee,ApprovalAuthority',
            },
            {
                name: 'Pending for Approval',
                url: '/leave/approval-pending-leave-list',
                icon: 'icon-hourglass',
                role: 'Admin,SuperAdministrator,ApprovalAuthority',
            },
            {
                name: 'Approved List',
                url: '/leave/approval-approved-leave-list',
                icon: 'icon-pin',
                role: 'Admin,SuperAdministrator,ApprovalAuthority',
            },
            {
                name: 'Rejected List',
                url: '/leave/approval-rejected-leave-list',
                icon: 'icon-minus',
                role: 'Admin,SuperAdministrator,ApprovalAuthority',
            },
            {
                name: 'All Leave List',
                url: '/leave/admin-all-leave-list',
                icon: 'icon-pin',
                role: 'SuperAdministrator',
            },
            {
                name: 'All Leave List',
                url: '/leave/authority-all-leave-list',
                icon: 'icon-pin',
                role: 'Admin,ApprovalAuthority',
            }
        ]
    },
    // {
    //     title: true,
    //     name: 'Flow Setup'
    // },
    {
        name: 'Approval',
        url: '/flow',
        icon: 'icon-layers',
        children: [
            {
                name: 'Approval Flow Setup',
                url: '/flow/approval-work-flow-setup',
                icon: 'icon-organization',
                role: 'Admin,SuperAdministrator'
            }
        ]
    },
];

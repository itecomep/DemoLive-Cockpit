import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const LEAVE_ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/leave-list/',
        pathMatch: 'full',
    },
    {
        path: ':id',
        loadComponent: () => import('./components/leave-list-view/leave-list-view.component').then(m => m.LeaveListViewComponent),
        data: {
            title: 'Leave List',
            // roles: ['CONTACT_LIST']
        },
        canActivate: [AuthGuard]
    },
];


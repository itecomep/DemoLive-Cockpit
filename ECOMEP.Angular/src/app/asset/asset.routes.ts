import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const ASSET_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/asset-view/asset-view.component').then(m => m.AssetViewComponent),
        data: { title: 'Assets' },
        canActivate: [AuthGuard]
    },
]
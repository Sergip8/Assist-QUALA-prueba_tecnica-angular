import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PublicComponent } from './public/public.component';
import { hasRoleGuard, Role } from './_core/guard/role.guard';

export enum AppRoutes{
  Admin = "admin",
  Public = ''
}
export const routes: Routes = [

    {
        path: AppRoutes.Public,
        component: PublicComponent,
        loadChildren: () => import('./public/public.module').then(m => m.PublicModule),
    },
       {
        path: AppRoutes.Admin,
        component: AdminComponent,
        canActivate : [hasRoleGuard],
        data:{
          roles: [Role.ADMIN]
        },
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
      },
];
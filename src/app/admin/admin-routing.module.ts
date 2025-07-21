import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoutes, ElementRoutes } from './admin.routes';

import { SucursalesListComponent } from './pages/sucursales-list/sucursales-list.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';




const routes: Routes = [
  {
    path: '',
    redirectTo: AdminRoutes.Dashboard,
    pathMatch: 'full',
  },
  {
    title: 'Dashboard',
    path: AdminRoutes.Dashboard,
    component: AdminDashboardComponent,
  },
  {
      title: 'Sucursales',
      path: AdminRoutes.Registros,
      children: [
        {
          title: 'ListaSucursales',
          path: ElementRoutes.Sucursales,
          component: SucursalesListComponent,
        },
        
       
       
      ],
  },

// { path: '**', component: AdminPageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
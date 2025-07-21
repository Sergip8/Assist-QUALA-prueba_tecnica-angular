import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminSidebarComponent } from './layouts/admin-sidebar/admin-sidebar.component';


import { NgZorroModule } from '../shared/layout.module';
import { RouterOutlet } from '@angular/router';
import { SucursalesListComponent } from './pages/sucursales-list/sucursales-list.component';
import { TableComponent } from '../shared/components/table/table.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { FormComponent } from '../shared/components/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip, Title, PieController, LinearScale, BarController, CategoryScale, BarElement} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip, Title, PieController, LinearScale, BarController, CategoryScale, BarElement);


@NgModule({

  declarations: [
   AdminComponent, AdminSidebarComponent, AdminSidebarComponent, SucursalesListComponent, FormComponent, ModalComponent, TableComponent, AdminDashboardComponent
  
    
  ],
  imports: [
    CommonModule,
   NgZorroModule,
   RouterOutlet,
   AdminRoutingModule,
   ReactiveFormsModule,
   FormsModule,
   BaseChartDirective
  ],
 
})
export class AdminModule { }


import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../_core/services/dashboard.service';
import { DashboardData, MonedaDistribucion, RolDistribucion } from '../../../models/dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private colors = {
    blue: '#007bff',
    indigo: '#6610f2',
    purple: '#6f42c1',
    pink: '#e83e8c',
    red: '#dc3545',
    orange: '#fd7e14',
    yellow: '#ffc107',
    green: '#28a745',
    teal: '#20c997',
    cyan: '#17a2b8',
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#dc3545'
  };


 public pieChartType: ChartType = 'pie';
  public doughnutChartType: ChartType = 'doughnut';
  public barChartType: ChartType = 'bar';

  // Datos para gráfico de distribución de monedas
  public monedasChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  public monedasChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribución de Monedas por Sucursales'
      }
    }
  };

  // Datos para gráfico de distribución de roles
  public rolesChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  public rolesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribución de Roles de Usuario'
      }
    }
  };

  // Datos para gráfico de estado del sistema
  public sistemaChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Porcentaje de Salud (%)',
      data: [],
      backgroundColor: []
    }]
  };

  public sistemaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Estado de Salud del Sistema'
      }
    }
  };

  // Estadísticas principales
  public mainStats = [
    { title: 'Sucursales Activas', value: 0, icon: 'shop', color: 'success' },
    { title: 'Usuarios Activos', value: 0, icon: 'user', color: 'primary' },
    { title: 'Monedas Activas', value: 0, icon: 'dollar', color: 'warning' },
    { title: 'Salud del Sistema', value: 0, icon: 'desktop', color: 'info' }
  ];
  dashboardData!: DashboardData

  constructor(private dashboardService: DashboardService){
    dashboardService.getDashboardData().subscribe(data => this.dashboardData = data)
  }

  ngOnInit(): void {
    this.initializeCharts();
    this.updateMainStats();
  }

  private initializeCharts(): void {
    this.setupMonedasChart();
    this.setupRolesChart();
    this.setupSistemaChart();
  }

  private setupMonedasChart(): void {
    const monedasConDatos = this.dashboardData.data.distribucionMonedas
      .filter(moneda => moneda.cantidadSucursales > 0);
    
    this.monedasChartData = {
      labels: monedasConDatos.map(m => `${m.nombreMoneda} (${m.simboloMoneda})`),
      datasets: [{
        data: monedasConDatos.map(m => m.porcentajeDistribucion),
        backgroundColor: [
          this.colors.primary,
          this.colors.success,
          this.colors.warning,
          this.colors.info,
          this.colors.purple,
          this.colors.orange
        ]
      }]
    };
  }

  private setupRolesChart(): void {
    const roles = this.dashboardData.data.distribucionRoles;
    
    this.rolesChartData = {
      labels: roles.map(r => r.rol),
      datasets: [{
        data: roles.map(r => r.cantidadUsuarios),
        backgroundColor: [
          this.colors.danger,
          this.colors.info,
          this.colors.secondary
        ]
      }]
    };
  }

  private setupSistemaChart(): void {
    const sistema = this.dashboardData.data.estadoSistema;
    
    this.sistemaChartData = {
      labels: sistema.map(s => s.categoria),
      datasets: [{
        label: 'Porcentaje de Salud (%)',
        data: sistema.map(s => s.porcentajeSalud),
        backgroundColor: sistema.map(s => 
          s.porcentajeSalud >= 99 ? this.colors.success : 
          s.porcentajeSalud >= 95 ? this.colors.warning : this.colors.danger
        )
      }]
    };
  }

  private updateMainStats(): void {
    const metrics = this.dashboardData.data.metrics;
    const avgSalud = this.dashboardData.data.estadoSistema
      .reduce((sum, s) => sum + s.porcentajeSalud, 0) / this.dashboardData.data.estadoSistema.length;

    this.mainStats = [
      { 
        title: 'Sucursales Activas', 
        value: metrics.totalSucursalesActivas, 
        icon: 'shop', 
        color: 'success' 
      },
      { 
        title: 'Usuarios Activos', 
        value: metrics.totalUsuariosActivos, 
        icon: 'user', 
        color: 'primary' 
      },
      { 
        title: 'Monedas Activas', 
        value: metrics.totalMonedasActivas, 
        icon: 'dollar', 
        color: 'warning' 
      },
      { 
        title: 'Salud del Sistema', 
        value: Math.round(avgSalud), 
        icon: 'desktop', 
        color: avgSalud >= 99 ? 'success' : avgSalud >= 95 ? 'warning' : 'danger'
      }
    ];
  }

  // Método para refrescar datos (opcional)
  refreshData(): void {
    // Aquí puedes llamar al servicio para obtener nuevos datos
    this.initializeCharts();
    this.updateMainStats();
  }
}

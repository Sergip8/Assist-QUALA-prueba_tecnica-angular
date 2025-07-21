import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData } from '../../models/dashboard.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private mockDashboardData: DashboardData = {
    success: true,
    message: 'Datos del dashboard obtenidos exitosamente',
    statusCode: '200',
    type: 'Success',
    data: {
      metrics: {
        totalSucursalesActivas: 5,
        totalSucursalesInactivas: 0,
        totalUsuariosActivos: 3,
        totalUsuariosInactivos: 0,
        totalMonedasActivas: 6,
        sucursalesRegistradasPeriodo: 0,
        usuariosRegistradosPeriodo: 0,
        fechaInicioReporte: '2024-01-01T00:00:00',
        fechaFinReporte: '2024-12-31T00:00:00',
        fechaGeneracionReporte: '2025-07-20T16:48:13.213',
      },
      distribucionMonedas: [
        {
          nombreMoneda: 'Peso Colombiano',
          simboloMoneda: 'COP$',
          cantidadSucursales: 3,
          porcentajeDistribucion: 60.0,
        },
        {
          nombreMoneda: 'Peso Mexicano',
          simboloMoneda: 'MXN',
          cantidadSucursales: 1,
          porcentajeDistribucion: 20.0,
        },
        {
          nombreMoneda: 'Peso Argentino',
          simboloMoneda: 'ARS',
          cantidadSucursales: 1,
          porcentajeDistribucion: 20.0,
        },
        {
          nombreMoneda: 'Libra Esterlina',
          simboloMoneda: '£',
          cantidadSucursales: 0,
          porcentajeDistribucion: 0.0,
        },
        {
          nombreMoneda: 'Dólar estadounidense',
          simboloMoneda: '$',
          cantidadSucursales: 0,
          porcentajeDistribucion: 0.0,
        },
        {
          nombreMoneda: 'Euro',
          simboloMoneda: '€',
          cantidadSucursales: 0,
          porcentajeDistribucion: 0.0,
        },
      ],
      distribucionRoles: [
        {
          rol: 'Admin',
          cantidadUsuarios: 1,
          porcentajeDistribucion: 33.33,
          usuariosActivos: 1,
          usuariosInactivos: 0,
        },
        {
          rol: 'Manager',
          cantidadUsuarios: 1,
          porcentajeDistribucion: 33.33,
          usuariosActivos: 1,
          usuariosInactivos: 0,
        },
        {
          rol: 'User',
          cantidadUsuarios: 1,
          porcentajeDistribucion: 33.33,
          usuariosActivos: 1,
          usuariosInactivos: 0,
        },
      ],
      actividadMensual: [
        {
          año: 2025,
          mes: 7,
          nombreMes: 'July 2025',
          sucursalesRegistradas: 5,
          usuariosRegistrados: 3,
        },
      ],
      sucursalesRecientes: [
        {
          idSucursal: 1,
          codigo: 1001,
          descripcion: 'Sucursal Principal Bogotá',
          direccion: 'Carrera 7 # 72-13, Bogotá D.C.',
          fechaRegistro: '2025-07-20T16:47:17.98',
          usuarioRegistro: 'admin_test',
          monedaNombre: 'Peso Colombiano',
          monedaSimbolo: 'COP$',
          estado: 'Activa',
        },
        {
          idSucursal: 2,
          codigo: 1002,
          descripcion: 'Sucursal Medellín Norte',
          direccion: 'Avenida 80 # 45-20, Medellín',
          fechaRegistro: '2025-07-20T16:47:17.98',
          usuarioRegistro: 'admin_test',
          monedaNombre: 'Peso Colombiano',
          monedaSimbolo: 'COP$',
          estado: 'Activa',
        },
        {
          idSucursal: 3,
          codigo: 1003,
          descripcion: 'Sucursal Cali Sur',
          direccion: 'Calle 5 # 34-80, Cali',
          fechaRegistro: '2025-07-20T16:47:17.98',
          usuarioRegistro: 'admin_test',
          monedaNombre: 'Peso Colombiano',
          monedaSimbolo: 'COP$',
          estado: 'Activa',
        },
        {
          idSucursal: 4,
          codigo: 1004,
          descripcion: 'Sucursal Ciudad de México',
          direccion: 'Paseo de la Reforma 296, CDMX',
          fechaRegistro: '2025-07-20T16:47:17.98',
          usuarioRegistro: 'admin_test',
          monedaNombre: 'Peso Mexicano',
          monedaSimbolo: 'MXN',
          estado: 'Activa',
        },
        {
          idSucursal: 5,
          codigo: 1005,
          descripcion: 'Sucursal Buenos Aires',
          direccion: 'Avenida Corrientes 1234, CABA',
          fechaRegistro: '2025-07-20T16:47:17.98',
          usuarioRegistro: 'admin_test',
          monedaNombre: 'Peso Argentino',
          monedaSimbolo: 'ARS',
          estado: 'Activa',
        },
      ],
      usuariosRecientes: [
        {
          idUsuario: 1,
          nombreUsuario: 'admin_test',
          email: 'admin@empresa.com',
          rol: 'Admin',
          fechaRegistro: '2025-07-20T16:47:17.75',
          estado: 'Activo',
          diasDesdeRegistro: 0,
        },
        {
          idUsuario: 3,
          nombreUsuario: 'manager_test',
          email: 'manager@empresa.com',
          rol: 'Manager',
          fechaRegistro: '2025-07-20T16:47:17.75',
          estado: 'Activo',
          diasDesdeRegistro: 0,
        },
        {
          idUsuario: 2,
          nombreUsuario: 'user_test',
          email: 'user@empresa.com',
          rol: 'User',
          fechaRegistro: '2025-07-20T16:47:17.75',
          estado: 'Activo',
          diasDesdeRegistro: 0,
        },
      ],
      estadoSistema: [
        {
          categoria: 'Sistema',
          estado: 'Operativo',
          porcentajeSalud: 100.0,
          ultimaVerificacion: '2025-07-20T16:48:13.223',
        },
        {
          categoria: 'Base de Datos',
          estado: 'Conectada',
          porcentajeSalud: 99.9,
          ultimaVerificacion: '2025-07-20T16:48:13.223',
        },
      ],
    },
    timestamp: '2025-07-20T21:48:13.3319461Z',
  };

  getDashboardData(): Observable<DashboardData> {
    return of(this.mockDashboardData);
  }
}
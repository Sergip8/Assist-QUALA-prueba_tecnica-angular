export interface DashboardData {
 
    metrics: Metrics;
    distribucionMonedas: MonedaDistribucion[];
    distribucionRoles: RolDistribucion[];
    actividadMensual: ActividadMensual[];
    sucursalesRecientes: Sucursal[];
    usuariosRecientes: Usuario[];
    estadoSistema: EstadoSistema[];
 
}

export interface Metrics {
  totalSucursalesActivas: number;
  totalSucursalesInactivas: number;
  totalUsuariosActivos: number;
  totalUsuariosInactivos: number;
  totalMonedasActivas: number;
  sucursalesRegistradasPeriodo: number;
  usuariosRegistradosPeriodo: number;
  fechaInicioReporte: string;
  fechaFinReporte: string;
  fechaGeneracionReporte: string;
}

export interface MonedaDistribucion {
  nombreMoneda: string;
  simboloMoneda: string;
  cantidadSucursales: number;
  porcentajeDistribucion: number;
}

export interface RolDistribucion {
  rol: string;
  cantidadUsuarios: number;
  porcentajeDistribucion: number;
  usuariosActivos: number;
  usuariosInactivos: number;
}

export interface ActividadMensual {
  año: number;
  mes: number;
  nombreMes: string;
  sucursalesRegistradas: number;
  usuariosRegistrados: number;
}

export interface Sucursal {
  idSucursal: number;
  codigo: number;
  descripcion: string;
  direccion: string;
  fechaRegistro: string;
  usuarioRegistro: string;
  monedaNombre: string;
  monedaSimbolo: string;
  estado: string;
}

export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  estado: string;
  diasDesdeRegistro: number;
}

export interface EstadoSistema {
  categoria: string;
  estado: string;
  porcentajeSalud: number;
  ultimaVerificacion: string;
}
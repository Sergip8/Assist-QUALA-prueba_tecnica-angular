export interface Sucursal {
  idSucursal: number;
  codigo: number;
  descripcion: string;
  direccion: string;
  identificacion: string;
  fechaCreacion: Date;
  idMoneda: number;
  activo: boolean;
  fechaRegistro: Date;
  usuarioRegistro: string;
  fechaModificacion?: Date | null;
  usuarioModificacion?: string | null;
  nombreMoneda?: string; 
}
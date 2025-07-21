import { FormConfig } from "../../shared/components/form/form.component";
import { TableColumn } from "../../shared/components/table/table.component";


export const sucursalTableColumns: TableColumn[] = [
  {
    key: 'idSucursal',
    label: 'ID',
    type: 'number',
    sortable: true,
    width: '80px',
    align: 'center'
  },
  {
    key: 'codigo',
    label: 'Código',
    type: 'number',
    sortable: true,
    width: '100px',
    align: 'center'
  },
  {
    key: 'descripcion',
    label: 'Descripción',
    type: 'text',
    sortable: true,
    width: '200px',
    align: 'left'
  },
  {
    key: 'direccion',
    label: 'Dirección',
    type: 'text',
    sortable: true,
    width: '250px',
    align: 'left'
  },
  {
    key: 'identificacion',
    label: 'Identificación',
    type: 'text',
    sortable: true,
    width: '150px',
    align: 'center'
  },
  {
    key: 'fechaCreacion',
    label: 'Fecha Creación',
    type: 'date',
    sortable: true,
    width: '130px',
    align: 'center'
  },
  {
    key: 'idMoneda',
    label: 'ID Moneda',
    type: 'number',
    sortable: true,
    width: '100px',
    align: 'center'
  },
  {
    key: 'activo',
    label: 'Estado',
    type: 'boolean',
    sortable: true,
    width: '80px',
    align: 'center'
  },
  {
    key: 'actions',
    label: 'Acciones',
    type: 'actions',
    sortable: false,
    width: '120px',
    align: 'center'
  }
];

export interface SucursalFormCallbacks {
  buscarMonedas: (searchTerm: string) => Promise<any[]>;
}

 
 export function createSucursalFormConfig(callbacks: SucursalFormCallbacks, isEditMode = false): FormConfig {
  return {
    title: isEditMode ? 'Editar Sucursal' : 'Crear Nueva Sucursal',
    subtitle: isEditMode ? 
      'Modifique los datos de la sucursal' : 
      'Complete los datos para registrar la sucursal',
    fields: [
      {
        name: 'codigo',
        label: 'Código',
        type: 'number',
        placeholder: 'Ingrese el código de la sucursal',
        required: true,
        disabled: isEditMode,
        errorMessages: {
          required: 'El código es obligatorio',
          pattern: 'Solo se permiten números'
        }
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Descripción de la sucursal',
        required: true,
        rows: 3,
        errorMessages: {
          required: 'La descripción es obligatoria'
        }
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Dirección completa de la sucursal',
        required: true,
        errorMessages: {
          required: 'La dirección es obligatoria'
        }
      },
      {
        name: 'identificacion',
        label: 'Identificación Fiscal',
        type: 'text',
        placeholder: 'Número de identificación fiscal',
        required: true,
        errorMessages: {
          required: 'La identificación es obligatoria'
        }
      },
      {
        name: 'idMoneda',
        label: 'Moneda',
        type: 'search',
        placeholder: 'Buscar moneda por nombre o código...',
        required: true,
        errorMessages: {
          required: 'Debe seleccionar una moneda'
        },
        searchConfig: {
          apiCall: callbacks.buscarMonedas, // ← Aquí usamos el callback
          valueKey: 'id',
          labelKey: 'nombre'
        }
      },
      // Ejemplo de otro campo con búsqueda
    
    ],
    submitButtonText: isEditMode ? 'Actualizar Sucursal' : 'Crear Sucursal',
    cancelButtonText: 'Cancelar',
    showCancelButton: true
  };
}

export function updateSucursalFormConfig(callbacks: SucursalFormCallbacks, isEditMode = true): FormConfig {
  return {
    title: isEditMode ? 'Editar Sucursal' : 'Crear Nueva Sucursal',
    subtitle: isEditMode ? 
      'Modifique los datos de la sucursal' : 
      'Complete los datos para registrar la sucursal',
    fields: [
      {
        name: 'codigo',
        label: 'Código',
        type: 'number',
        placeholder: 'Ingrese el código de la sucursal',
        required: true,
        disabled: isEditMode,
        errorMessages: {
          required: 'El código es obligatorio',
          pattern: 'Solo se permiten números'
        }
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Descripción de la sucursal',
        required: true,
        rows: 3,
        errorMessages: {
          required: 'La descripción es obligatoria'
        }
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Dirección completa de la sucursal',
        required: true,
        errorMessages: {
          required: 'La dirección es obligatoria'
        }
      },
      {
        name: 'identificacion',
        label: 'Identificación Fiscal',
        type: 'text',
        placeholder: 'Número de identificación fiscal',
        required: true,
        errorMessages: {
          required: 'La identificación es obligatoria'
        }
      },
      {
        name: 'idMoneda',
        label: 'Moneda',
        type: 'search',
        placeholder: 'Buscar moneda por nombre o código...',
        required: true,
        errorMessages: {
          required: 'Debe seleccionar una moneda'
        },
        searchConfig: {
          apiCall: callbacks.buscarMonedas, // ← Aquí usamos el callback
          valueKey: 'id',
          labelKey: 'nombre'
        }
      },
       {
        name: 'activo',
        label: 'Activo',
        type: 'checkbox',
        placeholder: 'Número de identificación fiscal',
        required: true,
        errorMessages: {
          required: 'La identificación es obligatoria'
        }
      },
      
    
    ],
    submitButtonText: isEditMode ? 'Actualizar Sucursal' : 'Crear Sucursal',
    cancelButtonText: 'Cancelar',
    showCancelButton: true
  };
}
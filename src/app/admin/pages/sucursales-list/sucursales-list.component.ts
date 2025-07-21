import { Component, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../shared/components/table/table.component';
import { createSucursalFormConfig, SucursalFormCallbacks, sucursalTableColumns, updateSucursalFormConfig } from '../../../models/table-schemas/sucursal.schema';
import { SucursalService } from '../../../_core/services/sucursal.service';
import { PaginationRequest, PaginationResponse } from '../../../models/pagination.model';
import { Sucursal } from '../../../models/sucursal.model';
import { FormConfig } from '../../../shared/components/form/form.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CustomModalService } from '../../../_core/services/modal.service';
import { monedaService } from '../../../_core/services/moneda.service';
import { SucursalUpdate } from '../../../models/sucursal-update.model';
import { SucursalCreate } from '../../../models/sucursal-create.model';
import { AuthService } from '../../../_core/services/auth.service';

@Component({
  selector: 'app-sucursales-list',
  standalone: false,
  templateUrl: './sucursales-list.component.html',
  styleUrl: './sucursales-list.component.css'
})
export class SucursalesListComponent  implements OnInit{


  private currentModal?: NzModalRef;
   isLoading = false;
   rightModalVisible = false;
  successModalVisible = false;
  paginationData!: PaginationResponse<Sucursal>
  sucursalForEdit!: Sucursal | null
  
   pagination = new PaginationRequest()
  includeInactive = true
  tableColumns: TableColumn[] = sucursalTableColumns
  formConfig!:FormConfig
  fielsToSearch = ["descripcion", "direccion"]
   

  constructor(private sucursalService: SucursalService, private monedaService: monedaService, private authService: AuthService){
    this.formConfig = createSucursalFormConfig({
      buscarMonedas: (term: string) => this.monedaService.getMonedas(term)
    })
  }
  ngOnInit(): void {
    this.getSucursalesPaginated()

  }

  getSucursalesPaginated(){
    this.sucursalService.getSucursalesPaginated(this.pagination, this.includeInactive).subscribe({
      next: data => {
        console.log(data)
        this.paginationData = data.data
      },
      error: e =>{}
    })
  }



  rowActions: TableAction[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      callback: (item) => this.onEdit(item)
    },
    {
      label: 'Eliminar',
      icon: 'delete',
      color: 'danger',
      callback: (item) => this.onDelete(item)
    }
  ];

  globalActions: TableAction[] = [
    {
      label: 'Nuevo Usuario',
      icon: 'plus',
      color: 'primary',
      callback: () => this.onAdd()
    },
    {
      label: 'Exportar',
      icon: 'export',
      color: 'default',
      callback: () => this.onExport()
    }
  ];

  onSortChange(sortEvent: {column: string, direction: 'asc' | 'desc' | null}): void {
    console.log('Sort changed:', sortEvent);
    if (sortEvent.column != "" && sortEvent.direction && sortEvent.column != "actions"){
      this.pagination.sortField = sortEvent.column
      this.pagination.sortOrder = sortEvent.direction as 'asc' | 'desc'
       this.getSucursalesPaginated()
    }
  }

  onEdit(item: any): void {
    this.formConfig =updateSucursalFormConfig({buscarMonedas: (term: string) => this.monedaService.getMonedas(term)})
    this.sucursalForEdit = item
    this.rightModalVisible = true
    console.log('Edit item:', item);
    // Implementar lógica de edición
  }

  onDelete(item: any): void {
    this.deleteSucursal(item.idSucursal)
    console.log('Delete item:', item);
    // Implementar lógica de eliminación
  }

  onAdd(): void {
    //this.modalService()
    this.rightModalVisible = true
    console.log('Add new item');
  }

  onExport(): void {
    console.log('Export data');
    // Implementar lógica de exportación
  }

  handleRightModalOk(): void {
    this.rightModalVisible = false;
    this.successModalVisible = true;
  }

  handleRightModalCancel(): void {
    console.log('Modal derecho - Cerrar clicked');
  }

  gotoPage(page: number) {
    this.pagination.page = page
    this.getSucursalesPaginated()
    
}
onSearch(term: string){
  this.pagination.query = term
  this.pagination.queryFields = this.fielsToSearch
  console.log(term)
}
onSubmit(data: any){
  const user = this.authService.getCurrentUser()
  if(user){
    if(this.sucursalForEdit){
      data["usuarioModificacion"] = user.email
      data["idSucursal"] = this.sucursalForEdit?.idSucursal
      this.updateSucursal(data.idSucursal, <SucursalUpdate>data)
      
    }
    else{
      data["usuarioRegistro"] = user.email

      this.createSucursal(<SucursalCreate>data)
    }
  }
}

createSucursal(sucursalData: SucursalCreate): void {
 
    
    this.sucursalService.createSucursal(sucursalData).subscribe({
      next: (response) => {
      
        if (response.success) {
          console.log('Sucursal creada exitosamente:', response.data);
          this.paginationData.items.push(response.data)
          this.rightModalVisible = false;

        } else {
          console.error('Error al crear sucursal:', response.message);
   
        }
      },
      error: (error) => {

        console.error('Error en la petición:', error);

      }
    });
  }

  // Actualizar sucursal existente
  updateSucursal(id: number, sucursalData: SucursalUpdate): void {
    this.sucursalForEdit = null
    
    this.sucursalService.updateSucursal(id, sucursalData).subscribe({
      next: (response) => {
     
        if (response.success) {
          console.log('Sucursal actualizada exitosamente:', response.data);
         
        } else {
          console.error('Error al actualizar sucursal:', response.message);
        
        }
      },
      error: (error) => {
     
        console.error('Error en la petición:', error);
       
      }
    });
  }

  // Eliminar sucursal
  deleteSucursal(id: number): void {
    // Opcional: Mostrar confirmación antes de eliminar
    if (!confirm('¿Está seguro de que desea eliminar esta sucursal?')) {
      return;
    }
    
  
    
    this.sucursalService.deleteSucursal(id).subscribe({
      next: (response) => {
  
        if (response.success && response.data) {
          console.log('Sucursal eliminada exitosamente');
       
        } else {
          console.error('Error al eliminar sucursal:', response.message);
     
        }
      },
      error: (error) => {
     
        console.error('Error en la petición:', error);
    
      }
    });
  }
}

import { Injectable, ComponentRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomModalService implements OnDestroy {

  private activeModals = new Set<NzModalRef>();
  private destroy$ = new Subject<void>();

  constructor(private modalService: NzModalService) {}

  ngOnDestroy(): void {
    console.log('CustomModalService: Destruyendo servicio...');
    
 
    this.closeAllModals();
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCenterModal(config: {
    title?: string;
    content?: any;
    width?: string | number;
    variant?: string;
    showFooter?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
  }): NzModalRef {
    console.log('CustomModalService: Abriendo modal center');
    
    const modalRef = this.modalService.create({
      nzTitle: config.title || '',
      nzContent: config.content,
      nzWidth: config.width || '600px',
      nzCentered: true,
      nzMaskClosable: true,
      nzKeyboard: true, // ✅ Permitir ESC para cerrar
      nzFooter: config.showFooter !== false ? [
        {
          label: 'Cancelar',
          onClick: () => {
            console.log('Modal center: Botón Cancelar');
            if (config.onCancel) config.onCancel();
            this.safeCloseModal(modalRef);
          }
        },
        {
          label: 'OK',
          type: 'primary',
          onClick: () => {
            console.log('Modal center: Botón OK');
            if (config.onOk) config.onOk();
            // No cerrar automáticamente, dejar que el callback maneje el cierre
          }
        }
      ] : null,
      nzWrapClassName: 'modal-center'
    });

    // ✅ Registrar modal activo
    this.trackModal(modalRef);
    
    return modalRef;
  }

  openRightModal(config: {
    title?: string;
    content?: any;
    width?: string | number;
    variant?: string;
    showFooter?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
  }): NzModalRef {
    console.log('CustomModalService: Abriendo modal right');
    
    const modalRef = this.modalService.create({
      nzTitle: config.title || '',
      nzContent: config.content,
      nzWidth: config.width || '600px',
      nzCentered: false,
      nzMaskClosable: true,
      nzKeyboard: true, // ✅ Permitir ESC para cerrar
      nzFooter: config.showFooter !== false ? [
        {
          label: 'Cancelar',
          onClick: () => {
            console.log('Modal right: Botón Cancelar');
            if (config.onCancel) config.onCancel();
            this.safeCloseModal(modalRef);
          }
        },
        {
          label: 'OK',
          type: 'primary',
          onClick: () => {
            console.log('Modal right: Botón OK');
            if (config.onOk) config.onOk();
            // No cerrar automáticamente, dejar que el callback maneje el cierre
          }
        }
      ] : null,
      nzWrapClassName: 'modal-right'
    });

    // ✅ Registrar modal activo
    this.trackModal(modalRef);
    
    return modalRef;
  }

  // ✅ MÉTODO CRÍTICO: Trackear modales para limpieza
  private trackModal(modalRef: NzModalRef): void {
    this.activeModals.add(modalRef);
    
    // ✅ Limpiar cuando el modal se cierre
    modalRef.afterClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Modal cerrado, removiendo del tracking');
          this.activeModals.delete(modalRef);
        },
        error: (err) => {
          console.error('Error al cerrar modal:', err);
          this.activeModals.delete(modalRef);
        }
      });
  }

  // ✅ Método para cerrar modal de forma segura
  safeCloseModal(modalRef: NzModalRef): void {
    if (modalRef && this.activeModals.has(modalRef)) {
      try {
        modalRef.close();
        this.activeModals.delete(modalRef);
        console.log('Modal cerrado de forma segura');
      } catch (error) {
        console.error('Error al cerrar modal:', error);
        this.activeModals.delete(modalRef);
      }
    }
  }

  // ✅ Método para cerrar todos los modales (útil para destrucción)
  closeAllModals(): void {
    console.log(`CustomModalService: Cerrando ${this.activeModals.size} modales activos...`);
    
    this.activeModals.forEach(modalRef => {
      try {
        modalRef.close();
      } catch (error) {
        console.error('Error cerrando modal durante cleanup:', error);
      }
    });
    
    this.activeModals.clear();
    console.log('CustomModalService: Todos los modales cerrados');
  }

  // ✅ Método público para obtener count de modales activos (debugging)
  getActiveModalsCount(): number {
    return this.activeModals.size;
  }
}
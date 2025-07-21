import { Component, EventEmitter, Input, Output, TemplateRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

export type ModalMode = 'center' | 'right';
export type ModalSize = 'small' | 'medium' | 'large' | 'extra-large';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() mode: ModalMode = 'center';
  @Input() size: ModalSize = 'medium';
  @Input() variant: string = 'primary';
  @Input() closable: boolean = true;
  @Input() maskClosable: boolean = true;
  @Input() showFooter: boolean = false;
  @Input() showOkButton: boolean = false;
  @Input() showCancelButton: boolean = false;
  @Input() okText: string = 'OK';
  @Input() cancelText: string = 'Cancelar';
  @Input() okLoading: boolean = false;
  @Input() cancelLoading: boolean = false;
  @Input() contentTemplate?: TemplateRef<any>;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  // ✅ Subject para manejar destrucción
  private destroy$ = new Subject<void>();
  private wasVisible = false;

  ngOnInit() {
    console.log('ModalComponent: Inicializado');
    this.wasVisible = this.visible;
  }

  ngOnDestroy() {
    console.log('ModalComponent: Iniciando destrucción...');
    
    // ✅ Limpiar todas las subscripciones
    this.destroy$.next();
    this.destroy$.complete();
    
    // ✅ Limpiar template reference si existe
    this.contentTemplate = undefined;
    
    // ✅ Cerrar modal si estaba abierto para evitar DOM zombies
    if (this.wasVisible) {
      this.visible = false;
      console.log('ModalComponent: Modal cerrado forzadamente durante destrucción');
    }
    
    console.log('ModalComponent: Destrucción completada');
  }

  getModalWidth(): string | number {
    if (this.mode === 'right') {
      switch (this.size) {
        case 'small': return '400px';
        case 'medium': return '600px';
        case 'large': return '800px';
        case 'extra-large': return '1000px';
        default: return '600px';
      }
    } else {
      // Modal central
      switch (this.size) {
        case 'small': return '400px';
        case 'medium': return '600px';
        case 'large': return '800px';
        case 'extra-large': return '1200px';
        default: return '600px';
      }
    }
  }

  getWrapClass(): string {
    return this.mode === 'right' ? 'modal-right' : 'modal-center';
  }

  handleOk(): void {
    if (this.destroy$.closed) return; // ✅ Evitar acciones post-destrucción
    this.onOk.emit();
  }

  handleCancel(): void {
    if (this.destroy$.closed) return; // ✅ Evitar acciones post-destrucción
    
    this.visible = false;
    this.wasVisible = false;
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

  // Métodos de utilidad para abrir/cerrar el modal
  open(): void {
    if (this.destroy$.closed) return; // ✅ Evitar acciones post-destrucción
    
    this.visible = true;
    this.wasVisible = true;
    this.visibleChange.emit(true);
  }

  close(): void {
    if (this.destroy$.closed) return; // ✅ Evitar acciones post-destrucción
    
    this.visible = false;
    this.wasVisible = false;
    this.visibleChange.emit(false);
  }
}
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';


export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'actions' | 'image';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}


export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'actions' | 'image';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: string;
  callback: (item: any) => void;
}

export interface PaginationConfig {
  pageSize: number;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
  showQuickJumper: boolean;
  showTotal: boolean;
}

// ✅ Interface para el evento de ordenamiento
export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | null;
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title?: string;
  @Input() sortable: boolean = true;
  @Input() rowActions: TableAction[] = [];
  @Input() globalActions: TableAction[] = [];
  @Input() emptyMessage?: string;
  @Input() loading: boolean = false;
  
  // ✅ Propiedades de paginación
  @Input() showPagination: boolean = true;
  @Input() pageSize: number = 4;
  @Input() showSizeChanger: boolean = true;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() showQuickJumper: boolean = true;
  @Input() showTotal: boolean = true;
  @Input() totalItems?: number;
  @Input() serverPagination: boolean = false;

  // ✅ NUEVO: Propiedades de búsqueda
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() searchMinLength: number = 3;
  @Input() searchDebounceTime: number = 300;

  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  
  // ✅ Eventos de paginación
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // ✅ NUEVO: Evento de búsqueda
  @Output() searchChange = new EventEmitter<string>();

  selectedImage: string | null = null;
  isImageModalVisible: boolean = false;

  // ✅ Propiedades internas de paginación
  currentPage: number = 1;
  currentPageSize: number = 10;

  // ✅ Propiedades para el ordenamiento
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;

  // ✅ NUEVO: Propiedades para la búsqueda
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // ✅ Subject para manejar la destrucción de subscripciones
  private destroy$ = new Subject<void>();

  // ✅ Cache para funciones de ordenamiento
  private sortFnCache = new Map<string, (a: any, b: any) => number>();

  ngOnInit(): void {
    this.currentPageSize = this.pageSize;
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    // ✅ Limpiar todas las subscripciones
    this.destroy$.next();
    this.destroy$.complete();
    
    // ✅ Limpiar cache
    this.sortFnCache.clear();
    
    // ✅ Limpiar referencias
    this.selectedImage = null;
    this.isImageModalVisible = false;
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.searchDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        if (searchTerm.length >= this.searchMinLength || searchTerm.length === 0) {
          this.searchChange.emit(searchTerm);
          // Resetear a la primera página cuando se busca
          this.currentPage = 1;
          this.pageChange.emit(1);
        }
      });
  }

  // ✅ NUEVO: Manejar el cambio en el input de búsqueda
  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  // ✅ NUEVO: Limpiar búsqueda
  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  // ✅ Getter para total de elementos
  get total(): number {
    return this.totalItems ?? this.data.length;
  }

  // ✅ Manejo de cambio de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  // ✅ Manejo de cambio de tamaño de página
  onPageSizeChange(size: number): void {
    this.currentPageSize = size;
    this.currentPage = 1;
    this.pageSizeChange.emit(size);
  }

  // ✅ Función para mostrar información del total
  totalNumber(total: number, range: [number, number]){
    return `${range[0]}-${range[1]} de ${total} elementos`;
  };

  // ✅ NUEVO: Manejo del evento de ordenamiento por columna
  onColumnSortChange(columnKey: string, sortOrder: string | null): void {
    if (!this.sortable) return;

    console.log('Column sort change:', columnKey, sortOrder); // Para debug

    // Determinar la nueva dirección de ordenamiento
    let newDirection: 'asc' | 'desc' | null = null;
    
    if (sortOrder === 'ascend') {
      newDirection = 'asc';
    } else if (sortOrder === 'descend') {
      newDirection = 'desc';
    }

    // Actualizar el estado interno
    this.currentSortColumn = newDirection ? columnKey : null;
    this.currentSortDirection = newDirection;

    // Emitir el evento
    this.sortChange.emit({
      column: columnKey,
      direction: newDirection
    });
  }

  // ✅ NUEVO: Método para obtener el estado de ordenamiento de una columna
  getSortOrder(columnKey: string): string | null {
    if (this.currentSortColumn === columnKey) {
      return this.currentSortDirection === 'asc' ? 'ascend' : 
             this.currentSortDirection === 'desc' ? 'descend' : null;
    }
    return null;
  }

  // ✅ NUEVO: Método para verificar si una columna es sorteable
  isColumnSortable(column: TableColumn): boolean {
    return this.sortable && (column.sortable !== false);
  }

  // ✅ Optimizado con memoización
  trackByFn = (index: number, item: any): any => {
    return item.id || item._id || index;
  };

  // ✅ Optimizado con memoización
  trackByColumn = (index: number, column: TableColumn): string => {
    return column.key;
  };

  getValue(item: any, key: string): any {
    if (!item || !key) return null;
    return key.split('.').reduce((obj, prop) => obj?.[prop], item);
  }

  // ✅ Versión cacheada para evitar recrear funciones constantemente
  getSortFn(key: string) {
    if (!this.sortFnCache.has(key)) {
      const sortFn = (a: any, b: any) => {
        const valueA = this.getValue(a, key);
        const valueB = this.getValue(b, key);
        
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        
        if (typeof valueA === 'string') {
          return valueA.localeCompare(valueB);
        }
        
        return valueA - valueB;
      };
      this.sortFnCache.set(key, sortFn);
    }
    return this.sortFnCache.get(key)!;
  }

  getButtonType(color?: string): 'primary' | 'default' | 'dashed' | 'text' | 'link' {
    switch (color) {
      case 'primary':
      case 'blue':
        return 'primary';
      case 'danger':
      case 'red':
        return 'primary';
      default:
        return 'default';
    }
  }

  getImageSrc(src: string | null | undefined): string {
    if (!src) return 'assets/images/no-image.png';
    return src;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/no-image.png';
    }
  }

  onImageClick(src: string): void {
    if (src && src !== 'assets/images/no-image.png') {
      this.selectedImage = src;
      this.isImageModalVisible = true;
    }
  }

  closeImageModal(): void {
    this.isImageModalVisible = false;
    this.selectedImage = null;
  }

  // ✅ Versión optimizada con cache
  private numberFormatCache = new Map<number, string>();
  
  formatNumber(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    
    const numValue = Number(value);
    if (isNaN(numValue)) return '';
    
    if (this.numberFormatCache.has(numValue)) {
      return this.numberFormatCache.get(numValue)!;
    }
    
    const formatted = new Intl.NumberFormat('es-CO').format(numValue);
    this.numberFormatCache.set(numValue, formatted);
    return formatted;
  }

  // ✅ Versión optimizada con cache
  private dateFormatCache = new Map<string, string>();
  
  formatDate(value: any): string {
    if (!value) return '';
    
    const dateStr = value.toString();
    if (this.dateFormatCache.has(dateStr)) {
      return this.dateFormatCache.get(dateStr)!;
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const formatted = date.toLocaleDateString('es-CO');
    this.dateFormatCache.set(dateStr, formatted);
    return formatted;
  }
}
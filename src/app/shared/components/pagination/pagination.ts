import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

import { debounceTime, distinctUntilChanged } from "rxjs";
import { Router } from "@angular/router";
import { PaginationService } from "../../../_core/services/pagination.service";
import { Pagination } from "./pagination-model";





@Component({
    selector: 'app-pagination',
    imports: [NgFor, NgIf, NgClass],
    template: `
<nav *ngIf="pageData && pageData.count != 0" aria-label="Pagination" class="pagination-nav">
  <div class="pagination-container">
 
    <button 
      (click)="goToPage(pageData.page - 1)" 
      [disabled]="pageData.page <= 1" 
      class="pagination-btn pagination-btn--nav">
      Anterior
    </button>

    <ng-container *ngFor="let p of pages">
      <button 
        *ngIf="p !== '...'; else dots" 
        (click)="goToPage(p)" 
        [ngClass]="{
          'active': p == pageData.page}"
        class="pagination-btn pagination-btn--page">
        {{ p }}
      </button>
      <ng-template #dots>
        <span class="pagination-dots">...</span>
      </ng-template>
    </ng-container>

    <button 
      (click)="goToPage(pageData.page + 1)" 
      [disabled]="pageData.page >= totalPages" 
      class="pagination-btn pagination-btn--nav">
      Siguiente
    </button>
  </div>
</nav>
    `,
    styles: [`
    $color-primary: var(--color-primary); // Azul oscuro
$color-secondary: var(--color-secondary); // Café claro/beige
$color-white: var(--color-white); // Blanco
$color-light-gray: var(--color-light-gray); // Gris claro
$color-dark: var(--color-dark); // Gris oscuro para texto
$color-accent: var(--color-accent); // Azul accent
$border-radius: 8px;
$padding-btn: 12px 16px;
$font-weight-semibold: 600;
$transition-duration: 0.3s;

.pagination-nav {
  margin: 1rem 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: $padding-btn;
  border: 2px solid transparent;
  border-radius: $border-radius;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-duration ease;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 3px rgba($color-accent, 0.3);
  }

  // Botones de navegación (Anterior/Siguiente)
  &--nav {
    background-color: $color-secondary;
    color: $color-primary;
    border-color: $color-secondary;

    &:hover:not(:disabled) {
      background-color: rgba($color-secondary, 0.3);
      transform: translateY(-1px);
    }

    &:disabled {
      background-color: $color-light-gray;
      color: rgba($color-dark, 0.3);
      cursor: not-allowed;
      transform: none;
      opacity: 0.6;
    }
  }

  // Botones de páginas
  &--page {
    background-color: $color-white;
    color: $color-primary;
    border-color: $color-secondary;

    &:hover:not(.pagination-btn--active) {
      background-color: rgba($color-secondary, 0.3);
      color: $color-primary;
      transform: translateY(-1px);
    }

    // Página activa
    &--active {
      background-color: $color-primary;
      color: $color-white;
      border-color: $color-primary;

      &:hover {
        background-color: rgba($color-primary, 0.3);
      }
    }
  }
}
.active {
      background-color: $color-secondary;
      color: $color-white;
      border-color: $color-secondary;

      &:hover {
        background-color: rgba($color-primary, 0.3);
      }
    }
.pagination-dots {
  padding: 12px 8px;
  color: rgba($color-primary, 0.3);
  font-weight: $font-weight-semibold;
}
    `]
})
export class PaginationComponent implements OnInit, OnChanges {

    constructor() { 
       
      
    }
    ngOnInit(): void {
        console.log(this.pageData);
      
    }
    totalPages: number = 0;
    pages: (number | string)[] = []; 

  ngOnChanges(change: SimpleChanges): void {
    console.log(change);
    if (change['pageData']) {
      this.pageData = change['pageData'].currentValue;
     
      this.updatePagination();
    }
   
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.pageData.count / this.pageData.size); 
    this.pages = this.getPages() 
    //this.router.navigate(['catalogo'], { queryParams: { page: this.pageData.page },queryParamsHandling: 'merge' });
  
  }

  goToPage(page: number| string): void {
    if (<number>page >= 1 && <number>page <= this.totalPages) {
      this.pageChange.emit(<number>page); 
    }
  }
  getPages(): (number | string)[] {
    const maxVisible = 5; 
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {

      const start = Math.max(2, this.pageData.page - 1); 
      const end = Math.min(this.totalPages - 1, this.pageData.page + 3); 

      pages.push(1);

      if (start > 2) {
        pages.push('...'); 
      }

      for (let i = start; i <= end; i++) {
        pages.push(i); 
      }

      if (end < this.totalPages - 1) {
        pages.push('...'); 
      }

      pages.push(this.totalPages); 
    }

    return pages;
  }
    @Input() pageData!: Pagination
    @Output() pageChange = new EventEmitter<number>()
  }
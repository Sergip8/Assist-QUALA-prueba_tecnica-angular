import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from '../../shared/components/pagination/pagination-model';



@Injectable({
  providedIn: 'root'
})

export class PaginationService {
  constructor() { }

    private paginationState = new BehaviorSubject<Pagination>({page: 1, count: 0, size: 10});
    currentPagination$ = this.paginationState.asObservable(); 
  
    updatePagination(updatedFilter: Partial<Pagination>) {
      const currentFilter = this.paginationState.value;
      this.paginationState.next({ ...currentFilter, ...updatedFilter });
    }
  
    resetPagination() {
      this.paginationState.next({page: 1, count: 0, size: 10});
    }
}
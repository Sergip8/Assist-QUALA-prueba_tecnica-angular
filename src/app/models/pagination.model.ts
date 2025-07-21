export class PaginationRequest {
  page: number = 1;
  pageSize: number = 10;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  query?: string 
  queryFields?: string[]
}

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

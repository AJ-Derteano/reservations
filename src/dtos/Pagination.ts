export interface Pagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
  search?: string;
  searchFields?: string[];
  populate?: string[];
  select?: string[];
}

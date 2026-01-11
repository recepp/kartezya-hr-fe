// Backend API Response Types (Based on actual Go API response)
export interface PagedResponse<T> {
  data: T[];
  page: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  };
  success: boolean;
}

export interface Page {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface SearchParams<T> {
  filter?: string;
  pageRequest: PageParams<T>;
}

export interface PageParams<T> {
  page?: number;
  size?: number;
  sort?: [{ direction?: 'ASC' | 'DESC' | string, property?: keyof T | string }];
}
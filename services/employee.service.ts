import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService } from './base.service';
import { Employee } from '@/models/hr/common.types';
import axiosInstance from '@/helpers/api/axiosInstance';

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  hireDate: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ListEmployeesParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

class EmployeeService extends BaseService<Employee> {
  constructor() {
    super(HR_ENDPOINTS.EMPLOYEES);
  }

  async listWithFilters(params: ListEmployeesParams) {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return axiosInstance.get(url);
  }
}

export const employeeService = new EmployeeService();
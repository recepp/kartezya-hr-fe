import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService } from './base.service';
import { Department } from '@/models/hr/common.types';

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  companyId: number;
}

class DepartmentService extends BaseService<Department> {
  constructor() {
    super(HR_ENDPOINTS.DEPARTMENTS);
  }
}

export const departmentService = new DepartmentService();
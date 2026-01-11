import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService, APIResponse } from './base.service';
import { Company } from '@/models/hr/common.types';

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxNumber?: string;
}

class CompanyService extends BaseService<Company> {
  constructor() {
    super(HR_ENDPOINTS.COMPANIES);
  }
}

export const companyService = new CompanyService();
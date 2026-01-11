import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService } from './base.service';
import { JobPosition } from '@/models/hr/common.types';

export interface CreateJobPositionRequest {
  title: string;
  description?: string;
  departmentId: number;
}

class JobPositionService extends BaseService<JobPosition> {
  constructor() {
    super(HR_ENDPOINTS.JOB_POSITIONS);
  }
}

export const jobPositionService = new JobPositionService();
import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService } from './base.service';

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  maxDays: number;
  isCarryOver: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveTypeRequest {
  name: string;
  description?: string;
  maxDays: number;
  isCarryOver: boolean;
}

class LeaveTypeService extends BaseService<LeaveType> {
  constructor() {
    super(HR_ENDPOINTS.LEAVE.TYPES);
  }
}

export const leaveTypeService = new LeaveTypeService();
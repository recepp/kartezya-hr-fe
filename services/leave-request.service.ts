import { HR_ENDPOINTS } from '@/contants/urls';
import { BaseService, APIResponse, PaginatedResponse, PaginationParams } from './base.service';
import { LeaveRequest } from '@/models/hr/common.types';
import axiosInstance from '@/helpers/api/axiosInstance';
import { getErrorMessage } from '@/helpers/HelperUtils';
import { toast } from 'react-toastify';

export interface CreateLeaveRequestRequest {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ApproveLeaveRequestRequest {
  approvedBy: number;
}

export interface RejectLeaveRequestRequest {
  rejectionReason: string;
}

class LeaveRequestService extends BaseService<LeaveRequest> {
  constructor() {
    super(HR_ENDPOINTS.LEAVE.REQUESTS);
  }

  // Get my leave requests (for employees)
  async getMyLeaveRequests(params?: PaginationParams): Promise<PaginatedResponse<LeaveRequest>> {
    try {
      const response = await axiosInstance.get(HR_ENDPOINTS.LEAVE.REQUESTS_ME, { params });
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }

  // Approve leave request (for managers/admins)
  async approveLeaveRequest(id: number, data: ApproveLeaveRequestRequest): Promise<APIResponse<LeaveRequest>> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${id}/approve`, data);
      toast.success('Leave request approved successfully!');
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }

  // Reject leave request (for managers/admins)
  async rejectLeaveRequest(id: number, data: RejectLeaveRequestRequest): Promise<APIResponse<LeaveRequest>> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${id}/reject`, data);
      toast.success('Leave request rejected successfully!');
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }

  // Cancel leave request (for employees - their own requests)
  async cancelLeaveRequest(id: number): Promise<APIResponse<LeaveRequest>> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${id}/cancel`);
      toast.success('Leave request cancelled successfully!');
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }
}

export const leaveRequestService = new LeaveRequestService();
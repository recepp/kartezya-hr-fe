import { HR_ENDPOINTS } from '@/contants/urls';
import { APIResponse } from './base.service';
import { LeaveBalance } from '@/models/hr/common.types';
import axiosInstance from '@/helpers/api/axiosInstance';
import { getErrorMessage } from '@/helpers/HelperUtils';
import { toast } from 'react-toastify';

export const leaveBalanceService = {
  // Get my leave balances
  getMyLeaveBalances: async (): Promise<APIResponse<LeaveBalance[]>> => {
    try {
      const response = await axiosInstance.get(HR_ENDPOINTS.LEAVE.BALANCES_ME);
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }
};
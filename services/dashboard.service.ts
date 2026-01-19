import { BaseService, APIResponse, PaginatedResponse } from './base.service';
import axiosInstance from '@/helpers/api/axiosInstance';
import { getErrorMessage } from '@/helpers/HelperUtils';
import { toast } from 'react-toastify';

const DASHBOARD_ENDPOINTS = {
  DATA: '/dashboard/data',
  EMPLOYEES_BY_GENDER: '/dashboard/employees-by-gender',
  EMPLOYEES_BY_POSITION: '/dashboard/employees-by-position',
  EMPLOYEES_BY_COMPANY_DEPARTMENT: '/dashboard/employees-by-company-department',
};

export interface DashboardData {
  total_employees: number;
  total_departments: number;
  total_companies: number;
  pending_leave_requests: number;
}

export interface GenderChartData {
  gender: string;
  count: number;
}

export interface PositionChartData {
  position_title: string;
  count: number;
}

export interface CompanyDepartmentChartData {
  company_name: string;
  department_name: string;
  count: number;
}

class DashboardService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getDashboardData(): Promise<APIResponse<DashboardData>> {
    try {
      const response = await axiosInstance.get(`${DASHBOARD_ENDPOINTS.DATA}`);
      return response.data;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  }

  async getEmployeesByGender(): Promise<APIResponse<GenderChartData[]>> {
    try {
      const response = await axiosInstance.get(`${DASHBOARD_ENDPOINTS.EMPLOYEES_BY_GENDER}`);
      return response.data;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  }

  async getEmployeesByPosition(): Promise<APIResponse<PositionChartData[]>> {
    try {
      const response = await axiosInstance.get(`${DASHBOARD_ENDPOINTS.EMPLOYEES_BY_POSITION}`);
      return response.data;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  }

  async getEmployeesByCompanyDepartment(): Promise<APIResponse<CompanyDepartmentChartData[]>> {
    try {
      const response = await axiosInstance.get(`${DASHBOARD_ENDPOINTS.EMPLOYEES_BY_COMPANY_DEPARTMENT}`);
      return response.data;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();

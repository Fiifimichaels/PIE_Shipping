import { adminService, Admin } from './adminService';

export const authService = {
  async login(email: string, password: string): Promise<{
    success: boolean;
    user?: Admin;
    error?: string;
  }> {
    return await adminService.login(email, password);
  },

  async getUsers(): Promise<Admin[]> {
    return await adminService.getAllAdmins();
  }
};
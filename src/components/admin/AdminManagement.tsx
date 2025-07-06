import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Shield, Users, Mail, Calendar } from 'lucide-react';
import { adminService, Admin } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'super_admin' | 'admin' | 'manager',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAdmin) {
        const result = await adminService.updateAdmin(editingAdmin.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role
        });
        
        if (result.success) {
          await loadAdmins();
          setEditingAdmin(null);
        } else {
          alert('Error updating admin: ' + result.error);
        }
      } else {
        const result = await adminService.createAdmin(formData);
        
        if (result.success) {
          await loadAdmins();
        } else {
          alert('Error creating admin: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred');
    }
    
    setFormData({ name: '', email: '', password: '', role: 'admin' });
    setShowCreateForm(false);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      const result = await adminService.deleteAdmin(id);
      if (result.success) {
        setAdmins(admins.filter(admin => admin.id !== id));
      } else {
        alert('Error deleting admin: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('An error occurred');
    }
  };

  const toggleAdminStatus = async (admin: Admin) => {
    try {
      const result = await adminService.updateAdmin(admin.id, {
        is_active: !admin.is_active
      });
      
      if (result.success) {
        await loadAdmins();
      } else {
        alert('Error updating admin status: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('An error occurred');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'manager': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return Shield;
      case 'admin': return Users;
      case 'manager': return Mail;
      default: return Users;
    }
  };

  const canManageAdmin = (targetAdmin: Admin) => {
    if (user?.role === 'super_admin') return true;
    if (user?.role === 'admin' && targetAdmin.role !== 'super_admin') return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {!editingAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                {user?.role === 'super_admin' && (
                  <option value="super_admin">Super Admin</option>
                )}
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingAdmin(null);
                  setFormData({ name: '', email: '', password: '', role: 'admin' });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {editingAdmin ? 'Update' : 'Create'} Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const RoleIcon = getRoleIcon(admin.role);
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {admin.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RoleIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(admin.role)}`}>
                            {admin.role.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {admin.last_login 
                            ? new Date(admin.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {canManageAdmin(admin) && (
                            <>
                              <button
                                onClick={() => handleEdit(admin)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Edit admin"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleAdminStatus(admin)}
                                className={`${
                                  admin.is_active 
                                    ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                    : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                }`}
                                title={admin.is_active ? 'Deactivate' : 'Activate'}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {admin.id !== user?.id && (
                                <button
                                  onClick={() => handleDelete(admin.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete admin"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
import { useState, useEffect } from 'react';
import { userAPI, labAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { usePagination } from '../hooks/usePagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Users as UsersIcon, Plus, Edit, Trash2, Shield } from 'lucide-react';

export const Users = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT',
    active: true,
    labId: '',
  });

  useEffect(() => {
    loadUsers();
    loadLabs();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadLabs = async () => {
    try {
      const response = await labAPI.getAll();
      setLabs(response.data.data || []);
    } catch (error) {
      console.error('Failed to load labs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await userAPI.update(editingItem.id, formData, formData.labId || null);
        showSuccess('User updated successfully');
      } else {
        await userAPI.create(formData, formData.labId || null);
        showSuccess('User created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(id);
      showSuccess('User deleted successfully');
      loadUsers();
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      username: item.username,
      email: item.email,
      password: '',
      firstName: item.firstName,
      lastName: item.lastName,
      role: item.role,
      active: item.active,
      labId: item.assignedLab?.id?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'STUDENT',
      active: true,
      labId: '',
    });
  };

  const filteredUsers = users.filter((item) => {
    const matchesSearch = item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || item.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(filteredUsers, 10);

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800',
      LAB_MANAGER: 'bg-blue-100 text-blue-800',
      INSTRUCTOR: 'bg-green-100 text-green-800',
      STUDENT: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <LoadingSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-xl text-gray-600">Manage system users and permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit User' : 'Create New User'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update user information' : 'Add a new user to the system'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  {!editingItem && (
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingItem}
                        minLength={6}
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="LAB_MANAGER">Lab Manager</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="STUDENT">Student</option>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="labId">Assigned Lab</Label>
                    <Select
                      id="labId"
                      value={formData.labId}
                      onChange={(e) => setFormData({ ...formData, labId: e.target.value })}
                    >
                      <option value="">No lab assigned</option>
                      {labs.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name} - {lab.location}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Search</Label>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search users..."
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="LAB_MANAGER">Lab Manager</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Student</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users List ({filteredUsers.length})</CardTitle>
            <CardDescription>All users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Lab</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.firstName} {item.lastName}</TableCell>
                          <TableCell>{item.username}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(item.role)}`}>
                              {item.role.replace(/_/g, ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{item.assignedLab?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


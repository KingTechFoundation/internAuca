import { useState, useEffect } from 'react';
import { maintenanceAPI, equipmentAPI, userAPI } from '../services/api';
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
import { Wrench, Plus, Edit, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export const Maintenance = () => {
  const { user, isAdmin, isLabManager } = useAuth();
  const { showSuccess, showError } = useToast();
  const [maintenance, setMaintenance] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    equipmentId: '',
    description: '',
    assignedTechnicianId: '',
    cost: '',
    notes: '',
  });

  useEffect(() => {
    loadMaintenance();
    loadEquipment();
    loadTechnicians();
  }, []);

  const loadMaintenance = async () => {
    try {
      setLoading(true);
      const response = await maintenanceAPI.getAll();
      setMaintenance(response.data.data || []);
    } catch (error) {
      showError('Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const loadEquipment = async () => {
    try {
      const response = await equipmentAPI.getAll();
      setEquipment(response.data.data || []);
    } catch (error) {
      console.error('Failed to load equipment');
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await userAPI.getByRole('LAB_MANAGER');
      setTechnicians(response.data.data || []);
    } catch (error) {
      console.error('Failed to load technicians');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await maintenanceAPI.update(editingItem.id, formData);
        showSuccess('Maintenance request updated successfully');
      } else {
        await maintenanceAPI.create(formData);
        showSuccess('Maintenance request created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadMaintenance();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save maintenance request');
    }
  };

  const handleAssignTechnician = async (id, technicianId) => {
    try {
      await maintenanceAPI.assignTechnician(id, technicianId);
      showSuccess('Technician assigned successfully');
      loadMaintenance();
    } catch (error) {
      showError('Failed to assign technician');
    }
  };

  const handleComplete = async (id, cost, notes) => {
    try {
      await maintenanceAPI.complete(id, cost, notes);
      showSuccess('Maintenance completed successfully');
      loadMaintenance();
    } catch (error) {
      showError('Failed to complete maintenance');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this maintenance request?')) return;
    try {
      await maintenanceAPI.cancel(id);
      showSuccess('Maintenance request cancelled');
      loadMaintenance();
    } catch (error) {
      showError('Failed to cancel maintenance request');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      equipmentId: item.equipment?.id?.toString() || '',
      description: item.description || '',
      assignedTechnicianId: item.assignedTechnician?.id?.toString() || '',
      cost: item.cost?.toString() || '',
      notes: item.notes || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      equipmentId: '',
      description: '',
      assignedTechnicianId: '',
      cost: '',
      notes: '',
    });
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const matchesSearch = item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(filteredMaintenance, 10);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
            <p className="text-xl text-gray-600">Track and manage equipment maintenance</p>
          </div>
          {(isAdmin || isLabManager) && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Maintenance Request' : 'Create Maintenance Request'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update maintenance request information' : 'Create a new maintenance request'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="equipmentId">Equipment *</Label>
                      <Select
                        id="equipmentId"
                        value={formData.equipmentId}
                        onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                        required
                      >
                        <option value="">Select equipment</option>
                        {equipment.map((eq) => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} - {eq.serialNumber}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        placeholder="Describe the issue..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignedTechnicianId">Assign Technician</Label>
                      <Select
                        id="assignedTechnicianId"
                        value={formData.assignedTechnicianId}
                        onChange={(e) => setFormData({ ...formData, assignedTechnicianId: e.target.value })}
                      >
                        <option value="">Select technician</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.firstName} {tech.lastName}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes..."
                      />
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
          )}
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
                  placeholder="Search maintenance..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests ({filteredMaintenance.length})</CardTitle>
            <CardDescription>All maintenance requests in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No maintenance requests found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.equipment?.name || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                          <TableCell>{item.requestedBy?.firstName} {item.requestedBy?.lastName}</TableCell>
                          <TableCell>{item.assignedTechnician ? `${item.assignedTechnician.firstName} ${item.assignedTechnician.lastName}` : 'Unassigned'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace(/_/g, ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{item.cost ? `$${item.cost}` : 'N/A'}</TableCell>
                          <TableCell>{item.requestDate ? format(new Date(item.requestDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {isLabManager && item.status === 'PENDING' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const technicianId = prompt('Enter technician ID:');
                                    if (technicianId) handleAssignTechnician(item.id, technicianId);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
                              {isLabManager && item.status === 'IN_PROGRESS' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const cost = prompt('Enter cost (optional):');
                                    const notes = prompt('Enter completion notes (optional):');
                                    handleComplete(item.id, cost ? parseFloat(cost) : null, notes);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {(isAdmin || isLabManager) && item.status !== 'COMPLETED' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancel(item.id)}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
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







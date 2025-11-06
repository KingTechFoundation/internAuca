import { useState, useEffect } from 'react';
import { equipmentAPI, labAPI } from '../services/api';
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
import { LoadingSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Wrench, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

export const Equipment = () => {
  const { user, isAdmin, isLabManager } = useAuth();
  const { showSuccess, showError } = useToast();
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [labFilter, setLabFilter] = useState('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serialNumber: '',
    labId: '',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    loadEquipment();
    loadLabs();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data.data || []);
    } catch (error) {
      showError('Failed to load equipment');
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
        await equipmentAPI.update(editingItem.id, formData);
        showSuccess('Equipment updated successfully');
      } else {
        await equipmentAPI.create(formData);
        showSuccess('Equipment created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadEquipment();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save equipment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await equipmentAPI.delete(id);
      showSuccess('Equipment deleted successfully');
      loadEquipment();
    } catch (error) {
      showError('Failed to delete equipment');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      serialNumber: item.serialNumber,
      labId: item.lab?.id?.toString() || '',
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      serialNumber: '',
      labId: '',
      status: 'AVAILABLE',
    });
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesLab = labFilter === 'ALL' || item.lab?.id?.toString() === labFilter;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(filteredEquipment, 10);

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      IN_USE: 'bg-blue-100 text-blue-800',
      UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      BROKEN: 'bg-red-100 text-red-800',
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Equipment Management</h1>
            <p className="text-xl text-gray-600">Manage all laboratory equipment</p>
          </div>
          {(isAdmin || isLabManager) && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update equipment information' : 'Add a new piece of equipment to the system'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Equipment Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serialNumber">Serial Number *</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="labId">Lab *</Label>
                      <Select
                        id="labId"
                        value={formData.labId}
                        onChange={(e) => setFormData({ ...formData, labId: e.target.value })}
                        required
                      >
                        <option value="">Select a lab</option>
                        {labs.map((lab) => (
                          <option key={lab.id} value={lab.id}>
                            {lab.name} - {lab.location}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="IN_USE">In Use</option>
                        <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                        <option value="BROKEN">Broken</option>
                      </Select>
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
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Search</Label>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search equipment..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_USE">In Use</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="BROKEN">Broken</option>
                </Select>
              </div>
              <div>
                <Label>Lab</Label>
                <Select value={labFilter} onChange={(e) => setLabFilter(e.target.value)}>
                  <option value="ALL">All Labs</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment List ({filteredEquipment.length})</CardTitle>
            <CardDescription>All equipment in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No equipment found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Lab</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        {(isAdmin || isLabManager) && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.lab?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace(/_/g, ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{item.description || 'N/A'}</TableCell>
                          {(isAdmin || isLabManager) && (
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
                          )}
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


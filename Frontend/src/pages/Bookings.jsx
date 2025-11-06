import { useState, useEffect } from 'react';
import { bookingAPI, labAPI } from '../services/api';
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
import { Calendar, Plus, Edit, Trash2, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const Bookings = () => {
  const { user, isAdmin, isLabManager, isInstructor, isStudent } = useAuth();
  const { showSuccess, showError } = useToast();
  const [bookings, setBookings] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [formData, setFormData] = useState({
    labId: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });

  useEffect(() => {
    loadBookings();
    loadLabs();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      let response;
      if (isAdmin || isLabManager) {
        response = await bookingAPI.getAll();
      } else {
        response = await bookingAPI.getMyBookings();
      }
      setBookings(response.data.data || []);
    } catch (error) {
      showError('Failed to load bookings');
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
        await bookingAPI.update(editingItem.id, formData);
        showSuccess('Booking updated successfully');
      } else {
        if (isInstructor) {
          await bookingAPI.createInstructor(formData);
        } else {
          await bookingAPI.createStudent(formData);
        }
        showSuccess(isInstructor ? 'Booking created successfully' : 'Booking request submitted');
      }
      setIsDialogOpen(false);
      resetForm();
      loadBookings();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save booking');
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingAPI.approve(id);
      showSuccess('Booking approved');
      loadBookings();
    } catch (error) {
      showError('Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingAPI.reject(id);
      showSuccess('Booking rejected');
      loadBookings();
    } catch (error) {
      showError('Failed to reject booking');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      showSuccess('Booking cancelled');
      loadBookings();
    } catch (error) {
      showError('Failed to cancel booking');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await bookingAPI.delete(id);
      showSuccess('Booking deleted successfully');
      loadBookings();
    } catch (error) {
      showError('Failed to delete booking');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      labId: item.lab?.id?.toString() || '',
      startTime: format(new Date(item.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(item.endTime), "yyyy-MM-dd'T'HH:mm"),
      purpose: item.purpose || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      labId: '',
      startTime: '',
      endTime: '',
      purpose: '',
    });
  };

  const filteredBookings = bookings.filter((item) => {
    const matchesSearch = item.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lab?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination(filteredBookings, 10);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookings</h1>
            <p className="text-xl text-gray-600">Manage lab bookings and reservations</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
            >
              Table View
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            {(isInstructor || isStudent) && (
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Booking' : 'Create New Booking'}</DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Update booking information' : 'Book a lab for your class or project'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                          id="purpose"
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                          placeholder="e.g., Database Systems Class"
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
                  placeholder="Search bookings..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        {viewMode === 'table' ? (
          <Card>
            <CardHeader>
              <CardTitle>Bookings List ({filteredBookings.length})</CardTitle>
              <CardDescription>All bookings in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {paginatedItems.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lab</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.lab?.name || 'N/A'}</TableCell>
                            <TableCell>{item.user?.firstName} {item.user?.lastName}</TableCell>
                            <TableCell>{format(new Date(item.startTime), 'MMM dd, yyyy HH:mm')}</TableCell>
                            <TableCell>{format(new Date(item.endTime), 'MMM dd, yyyy HH:mm')}</TableCell>
                            <TableCell>{item.purpose || 'N/A'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {isLabManager && item.status === 'PENDING' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApprove(item.id)}
                                    >
                                      <Check className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReject(item.id)}
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                                {(item.user?.id === user?.id || isAdmin) && item.status !== 'COMPLETED' && (
                                  <>
                                    {item.user?.id === user?.id && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(item)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCancel(item.id)}
                                    >
                                      <Clock className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {isAdmin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View bookings in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Calendar view coming soon</p>
                <p className="text-sm text-gray-500 mt-2">Switch to table view for now</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


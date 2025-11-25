import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { BarChart3, TrendingUp, DollarSign, Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const Reports = () => {
  const { showError } = useToast();
  const [equipmentData, setEquipmentData] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadReports();
  }, [selectedMonth]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [equipmentRes, maintenanceRes, monthlyRes] = await Promise.all([
        reportsAPI.equipmentUtilization(),
        reportsAPI.maintenanceStatistics(),
        reportsAPI.monthlyLabUsage(selectedMonth),
      ]);
      
      setEquipmentData(equipmentRes.data.data);
      setMaintenanceData(maintenanceRes.data.data);
      setMonthlyData(monthlyRes.data.data);
    } catch (error) {
      showError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const equipmentChartData = equipmentData ? [
    { name: 'Available', value: equipmentData.available, color: '#10b981' },
    { name: 'In Use', value: equipmentData.inUse, color: '#3b82f6' },
    { name: 'Under Maintenance', value: equipmentData.underMaintenance, color: '#f59e0b' },
    { name: 'Broken', value: equipmentData.broken, color: '#ef4444' },
  ] : [];

  const maintenanceChartData = maintenanceData ? [
    { name: 'Pending', value: maintenanceData.pending, color: '#f59e0b' },
    { name: 'In Progress', value: maintenanceData.inProgress, color: '#3b82f6' },
    { name: 'Completed', value: maintenanceData.completed, color: '#10b981' },
  ] : [];

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-xl text-gray-600">Comprehensive system analytics and insights</p>
        </div>

        {/* Monthly Report Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Lab Usage Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="grid gap-2">
                <Label htmlFor="month">Select Month</Label>
                <Input
                  id="month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <Button onClick={loadReports}>Load Report</Button>
            </div>
            {monthlyData && (
              <div className="mt-6 grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{monthlyData.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{monthlyData.approvedBookings}</div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">{monthlyData.pendingBookings}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{monthlyData.bookings?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Equipment Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Equipment Utilization
              </CardTitle>
              <CardDescription>Current equipment status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {equipmentData && (
                <>
                  <div className="mb-4">
                    <div className="text-3xl font-bold">{equipmentData.totalEquipment}</div>
                    <p className="text-sm text-muted-foreground">Total Equipment</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Utilization Rate</span>
                        <span className="font-bold">{equipmentData.utilizationRate?.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${equipmentData.utilizationRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={equipmentChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {equipmentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-semibold text-green-600">{equipmentData.available}</div>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{equipmentData.inUse}</div>
                      <p className="text-xs text-muted-foreground">In Use</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-yellow-600">{equipmentData.underMaintenance}</div>
                      <p className="text-xs text-muted-foreground">Under Maintenance</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-red-600">{equipmentData.broken}</div>
                      <p className="text-xs text-muted-foreground">Broken</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Maintenance Statistics
              </CardTitle>
              <CardDescription>Maintenance requests and costs</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceData && (
                <>
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{maintenanceData.totalRequests}</div>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{maintenanceData.completed}</div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        <DollarSign className="inline h-5 w-5" />
                        {maintenanceData.totalCost?.toFixed(2) || '0.00'}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={maintenanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Cost per Completion</span>
                      <span className="font-bold">
                        <DollarSign className="inline h-4 w-4" />
                        {maintenanceData.averageCost?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};







import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Users, Calendar, Wrench, BarChart3, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export const Dashboard = () => {
  const { user } = useAuth();

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          title: 'Admin Dashboard',
          description: 'Manage all aspects of the lab management system',
          cards: [
            { title: 'Users', icon: Users, link: '/admin/users', color: 'blue' },
            { title: 'Labs', icon: Building2, link: '/labs', color: 'green' },
            { title: 'Equipment', icon: Wrench, link: '/equipment', color: 'purple' },
            { title: 'Bookings', icon: Calendar, link: '/bookings', color: 'orange' },
            { title: 'Maintenance', icon: Wrench, link: '/maintenance', color: 'red' },
            { title: 'Reports', icon: BarChart3, link: '/admin/reports', color: 'indigo' },
          ],
        };
      case 'LAB_MANAGER':
        return {
          title: 'Lab Manager Dashboard',
          description: 'Manage your assigned labs and equipment',
          cards: [
            { title: 'Labs', icon: Building2, link: '/labs', color: 'blue' },
            { title: 'Equipment', icon: Wrench, link: '/equipment', color: 'green' },
            { title: 'Bookings', icon: Calendar, link: '/bookings', color: 'purple' },
            { title: 'Maintenance', icon: Wrench, link: '/maintenance', color: 'orange' },
          ],
        };
      case 'INSTRUCTOR':
        return {
          title: 'Instructor Dashboard',
          description: 'Book labs and manage your classes',
          cards: [
            { title: 'Labs', icon: Building2, link: '/labs', color: 'blue' },
            { title: 'Bookings', icon: Calendar, link: '/bookings', color: 'green' },
            { title: 'Equipment', icon: Wrench, link: '/equipment', color: 'purple' },
          ],
        };
      case 'STUDENT':
        return {
          title: 'Student Dashboard',
          description: 'Request lab access and view schedules',
          cards: [
            { title: 'Labs', icon: Building2, link: '/labs', color: 'blue' },
            { title: 'Bookings', icon: Calendar, link: '/bookings', color: 'green' },
            { title: 'Equipment', icon: Wrench, link: '/equipment', color: 'purple' },
          ],
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to AUCA Lab Management',
          cards: [],
        };
    }
  };

  const content = getRoleBasedContent();
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-xl text-gray-600">{content.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colorClasses[card.color]} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName} {user?.lastName}!</CardTitle>
            <CardDescription>
              You are logged in as {user?.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {user?.username}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


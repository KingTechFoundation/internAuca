import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { GraduationCap, Users, Calendar, Wrench, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AUCA Lab Management
              <span className="block text-blue-600 mt-2">System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your laboratory operations with our comprehensive management platform.
              Manage equipment, schedule bookings, track maintenance, and generate insightful reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your labs efficiently</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">
                Role-based access control for Admins, Lab Managers, Instructors, and Students with granular permissions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-shadow">
              <Calendar className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lab Scheduling</h3>
              <p className="text-gray-600">
                Smart booking system with conflict detection. Instructors get instant approval, students request access.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-shadow">
              <Wrench className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maintenance Tracking</h3>
              <p className="text-gray-600">
                Complete maintenance workflow from request to completion with technician assignment and cost tracking.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive reports on lab usage, equipment utilization, and maintenance statistics.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                JWT-based authentication with audit logging for all actions, ensuring security and compliance.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Track equipment status, booking availability, and maintenance progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Built for AUCA's unique laboratory management needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">Intuitive interface designed for all user roles</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive</h3>
                <p className="text-gray-600">All-in-one solution for lab management</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scalable</h3>
                <p className="text-gray-600">Supports multiple labs and growing user base</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliable</h3>
                <p className="text-gray-600">99% uptime with automatic backups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join AUCA's lab management system today and streamline your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};


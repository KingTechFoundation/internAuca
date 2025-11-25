import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  GraduationCap,
  Users,
  Calendar,
  Wrench,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Microscope,
  Laptop,
  Beaker
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">LabMaster</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-white/10 text-lg">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold text-lg px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-slate-900/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            v2.0 Now Available for Fall Semester 2025
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Next-Gen Laboratory <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Management System
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering AUCA's scientific community with seamless equipment scheduling,
            real-time inventory tracking, and automated maintenance workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="h-16 px-8 text-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                Start Managing Labs
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-16 px-8 text-xl text-white border-white/20 hover:bg-white/10 backdrop-blur-sm">
                Access Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
            {[
              { label: 'Active Labs', value: '15+' },
              { label: 'Daily Users', value: '2,000+' },
              { label: 'Equipment Items', value: '5,000+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-200/60 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase mb-3">Powerful Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Everything you need to run a modern lab</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Streamline operations and reduce administrative burden with our comprehensive suite of tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Role-Based Access",
                description: "Granular permissions for Admins, Lab Managers, Instructors, and Students ensure secure and appropriate access."
              },
              {
                icon: <Calendar className="h-8 w-8 text-indigo-600" />,
                title: "Smart Scheduling",
                description: "Conflict-free booking system with instant approvals for instructors and request workflows for students."
              },
              {
                icon: <Wrench className="h-8 w-8 text-cyan-600" />,
                title: "Maintenance Tracking",
                description: "End-to-end maintenance lifecycle management, from issue reporting to technician assignment and resolution."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
                title: "Advanced Analytics",
                description: "Gain insights into lab utilization, equipment downtime, and resource allocation with detailed reports."
              },
              {
                icon: <Shield className="h-8 w-8 text-violet-600" />,
                title: "Enterprise Security",
                description: "JWT-based authentication, comprehensive audit logging, and secure data encryption keep your data safe."
              },
              {
                icon: <Clock className="h-8 w-8 text-rose-600" />,
                title: "Real-Time Monitoring",
                description: "Track equipment status and lab occupancy in real-time to optimize resource usage."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Trusted by AUCA Departments</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center space-x-3">
              <Laptop className="h-8 w-8 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">Computer Science</span>
            </div>
            <div className="flex items-center space-x-3">
              <Microscope className="h-8 w-8 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">Biotechnology</span>
            </div>
            <div className="flex items-center space-x-3">
              <Beaker className="h-8 w-8 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">Chemistry</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">Engineering</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">LabMaster</span>
              </div>
              <p className="max-w-xs">
                The official laboratory management system for AUCA.
                Streamlining research and education since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Lab Rules</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>support@auca.edu</li>
                <li>+250 788 000 000</li>
                <li>Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} AUCA Lab Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

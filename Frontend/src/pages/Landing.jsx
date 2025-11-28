import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  GraduationCap,
  Users,
  Calendar,
  Wrench,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  Microscope,
  Laptop,
  Beaker,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/images/university_lab_1_1764319013741.png',
    '/images/university_lab_2_1764319053957.png',
    '/images/university_lab_3_1764319077562.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">LabMaster</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-white/10 text-lg font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-lg px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* 3D Sliding Background */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                ? 'opacity-100 scale-100'
                : index === (currentSlide - 1 + slides.length) % slides.length
                  ? 'opacity-0 scale-110 -translate-x-full'
                  : 'opacity-0 scale-90 translate-x-full'
                }`}
              style={{
                transform: index === currentSlide ? 'translateZ(0) rotateY(0deg)' : 'translateZ(-100px) rotateY(10deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              <img
                src={slide}
                alt={`Lab ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-purple-900/40 animate-pulse"></div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-12 bg-white' : 'w-2 bg-white/50'
                }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-30 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 mb-8 backdrop-blur-md animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-3 animate-pulse"></span>
                <span className="font-medium">v2.0 Now Available for Fall Semester 2025</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-tight animate-fade-in-up">
                Transform Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 animate-gradient">
                  Laboratory Experience
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
                Streamline lab operations, manage equipment effortlessly, and empower your academic community with cutting-edge technology.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-400">
                <Link to="/register">
                  <Button size="lg" className="h-16 px-10 text-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl shadow-blue-900/50 transition-all hover:scale-105 hover:shadow-blue-900/70 group">
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-xl text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-md transition-all hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex items-center space-x-8 animate-fade-in-up animation-delay-600">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-white/90 font-medium ml-3">2,000+ Active Users</span>
                </div>
                <div className="h-8 w-px bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-white/90 font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Labs', value: '15+', icon: <Microscope className="h-8 w-8" /> },
              { label: 'Daily Users', value: '2,000+', icon: <Users className="h-8 w-8" /> },
              { label: 'Equipment Items', value: '5,000+', icon: <Wrench className="h-8 w-8" /> },
              { label: 'Uptime', value: '99.9%', icon: <Shield className="h-8 w-8" /> },
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className="text-blue-400 mb-3 flex justify-center group-hover:text-blue-300 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-200/70 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase mb-3 text-sm">Powerful Capabilities</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Everything You Need</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern laboratory management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10" />,
                title: "Role-Based Access",
                description: "Granular permissions for Admins, Lab Managers, Instructors, and Students.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Calendar className="h-10 w-10" />,
                title: "Smart Scheduling",
                description: "Conflict-free booking with instant approvals and automated workflows.",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: <Wrench className="h-10 w-10" />,
                title: "Maintenance Tracking",
                description: "Complete lifecycle management from reporting to resolution.",
                color: "from-cyan-500 to-cyan-600"
              },
              {
                icon: <BarChart3 className="h-10 w-10" />,
                title: "Advanced Analytics",
                description: "Detailed insights into utilization, downtime, and resource allocation.",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Enterprise Security",
                description: "JWT authentication, audit logging, and data encryption.",
                color: "from-violet-500 to-violet-600"
              },
              {
                icon: <Clock className="h-10 w-10" />,
                title: "Real-Time Monitoring",
                description: "Track equipment status and lab occupancy instantly.",
                color: "from-rose-500 to-rose-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of students and faculty already using LabMaster to streamline their laboratory operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register">
              <Button size="lg" className="h-16 px-12 text-xl bg-white text-blue-700 hover:bg-blue-50 shadow-2xl hover:scale-105 transition-all font-bold">
                Create Free Account
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-16 px-12 text-xl text-white border-2 border-white/50 hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all font-semibold">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">LabMaster</span>
              </div>
              <p className="max-w-sm text-lg leading-relaxed">
                The official laboratory management system for AUCA. Streamlining research and education since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition-colors text-lg">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors text-lg">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors text-lg">Lab Rules</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3 text-lg">
                <li>support@auca.edu</li>
                <li>+250 788 000 000</li>
                <li>Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-lg">&copy; {new Date().getFullYear()} AUCA Lab Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

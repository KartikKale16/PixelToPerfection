import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { eventsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { 
  CalendarIcon, 
  DollarSignIcon, 
  SearchIcon, 
  UsersIcon, 
  ArrowUpIcon, 
  SettingsIcon,
  PlusCircleIcon,
  ClipboardListIcon,
  UserPlusIcon,
  GraduationCapIcon,
  CalendarPlusIcon,
  Users2Icon,
  ListIcon,
  EditIcon,
  MapPinIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [timeframe, setTimeframe] = useState('week');
  const [eventCount, setEventCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const response = await eventsApi.getAllEvents();
        if (response.success) {
          setEventCount(response.count || 0);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Club Dashboard</h1>
            <p className="text-muted-foreground">Monitor and analyze your club data in the easiest way</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button className="p-2 bg-gray-900 text-white rounded-md">
              <CalendarIcon size={20} />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-6">
            <button 
              className={`px-6 py-2 rounded-md transition ${timeframe === 'week' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`px-6 py-2 rounded-md transition ${timeframe === 'month' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`px-6 py-2 rounded-md transition ${timeframe === 'year' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1: Club Members */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Total Members</h3>
                <UsersIcon className="text-purple-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">84</span>
                <span className="ml-3 text-green-500 flex items-center text-sm">
                  <ArrowUpIcon size={14} className="mr-1" />
                  +5 last week
                </span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
            </div>
            
            {/* Card 2: Upcoming Events */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Upcoming Events</h3>
                <CalendarIcon className="text-cyan-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">{isLoading ? '...' : eventCount}</span>
                <span className="ml-3 text-green-500 flex items-center text-sm">
                  <ArrowUpIcon size={14} className="mr-1" />
                  Events scheduled
                </span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
            
            {/* Card 3: Budget Expenses */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Budget Expenses</h3>
                <DollarSignIcon className="text-gray-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">$4,280</span>
                <span className="ml-3 text-red-500 flex items-center text-sm">
                  +15% from last month
                </span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Management Options Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Club Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Events Management Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/events/list')}>
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                <CalendarIcon className="text-blue-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Event Management</h3>
              <p className="text-gray-500 text-sm">Create and manage club events</p>
            </div>

            {/* Club Members Management Card */}
            <div 
              className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/members')}
            >
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-pink-100 rounded-full mb-4">
                <UsersIcon className="text-pink-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Member Directory</h3>
              <p className="text-gray-500 text-sm">Manage club membership & roles</p>
            </div>

            {/* Students Management Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-100 rounded-full mb-4">
                <GraduationCapIcon className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Student Registry</h3>
              <p className="text-gray-500 text-sm">Track academic performance & activities</p>
            </div>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Prediction Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M4.5 2.5C3.12 2.5 2 3.62 2 5s1.12 2.5 2.5 2.5C6.17 7.5 7 5.87 7 5s-.83-2.5-2.5-2.5z"></path>
                  <path d="M20 11.5h-5"></path>
                  <path d="M15 9v5"></path>
                  <path d="M4 9.5c0 1.5.83 2.5 2.5 2.5s2.5-1 2.5-2.5"></path>
                  <path d="M4 14.5c0 1.5.83 2.5 2.5 2.5s2.5-1 2.5-2.5"></path>
                  <path d="M9 17.5V5"></path>
                  <path d="M18 4h2c1.1 0 2 .9 2 2v3.62a2 2 0 0 1-.5 1.33l-4.38 4.38a2 2 0 0 1-2.82 0l-2.94-2.94a2 2 0 0 0-2.82 0L2 19.85"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Based Prediction</h3>
              <p className="text-gray-500 text-sm">Activity recommendations & engagement forecasting</p>
            </div>

            {/* Resource Marketplace Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-pink-100 rounded-full mb-4">
                <MapPinIcon className="text-pink-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Resource Marketplace</h3>
              <p className="text-gray-500 text-sm">Equipment rental & venue planning</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin; 
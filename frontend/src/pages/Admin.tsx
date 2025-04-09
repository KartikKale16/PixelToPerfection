import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin, fetchWithAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Verify token validity with backend
    const verifyToken = async () => {
      const data = await fetchWithAuth('http://localhost:5000/api/auth/me');
      if (!data || !data.success) {
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground mb-4">
              Manage user accounts, roles, and permissions
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
              View Users
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Content Management</h2>
            <p className="text-muted-foreground mb-4">
              Create and manage site content and events
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
              Manage Content
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
            <p className="text-muted-foreground mb-4">
              Configure application settings and preferences
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
              View Settings
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin; 
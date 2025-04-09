import React from 'react';
import { Helmet } from 'react-helmet-async';
import MemberForm from '@/components/MemberForm';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';

const CreateMember = () => {
  const { user, loading } = useAuth();
  
  // Make sure only admins can access this page
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/members" replace />;
  }
  
  return (
    <>
      <Helmet>
        <title>Add Member | ACES</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Member</h1>
          <p className="text-muted-foreground">Create a new committee member profile</p>
        </div>
        
        <MemberForm />
      </div>
    </>
  );
};

export default CreateMember; 
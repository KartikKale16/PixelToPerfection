import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Navigate } from 'react-router-dom';
import MemberForm from '@/components/MemberForm';
import { useAuth } from '@/lib/AuthContext';

const EditMember = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  
  // Make sure only admins can access this page
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/members" replace />;
  }
  
  // Make sure we have an ID
  if (!id) {
    return <Navigate to="/members" replace />;
  }
  
  return (
    <>
      <Helmet>
        <title>Edit Member | ACES</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Member</h1>
          <p className="text-muted-foreground">Update committee member information</p>
        </div>
        
        <MemberForm />
      </div>
    </>
  );
};

export default EditMember; 
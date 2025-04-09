import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Index from "./pages/Index";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import CreateEvent from "./pages/CreateEvent";
import EventListing from "./pages/EventListing";
import EventDetails from "./pages/EventDetails";
import EventEdit from "./pages/EventEdit";
import Members from "./pages/Members";
import CreateMember from "./pages/CreateMember";
import EditMember from "./pages/EditMember";
import Gallery from "./pages/Gallery";
import GalleryManage from "./pages/GalleryManage";
import Students from "./pages/Students";
import CreateStudent from "./pages/CreateStudent";
import EditStudent from "./pages/EditStudent";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/list" 
                element={
                  <ProtectedRoute>
                    <EventListing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/create" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'member']}>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/:id" 
                element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EventEdit />
                  </ProtectedRoute>
                } 
              />
              {/* Members Routes */}
              <Route path="/members" element={<Members />} />
              <Route 
                path="/members/create" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CreateMember />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members/edit/:id" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EditMember />
                  </ProtectedRoute>
                } 
              />
              {/* Gallery Routes */}
              <Route path="/gallery" element={<Gallery />} />
              <Route 
                path="/gallery/manage" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GalleryManage />
                  </ProtectedRoute>
                } 
              />
              {/* Students Routes */}
              <Route 
                path="/students" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/students/create" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CreateStudent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students/edit/:id" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EditStudent />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

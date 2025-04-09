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

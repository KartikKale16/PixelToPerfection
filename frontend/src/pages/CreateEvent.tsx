import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { eventsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Upload } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    tags: '',
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || 
        !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const eventData = new FormData();
      eventData.append('title', formData.title);
      eventData.append('description', formData.description);
      eventData.append('location', formData.location);
      eventData.append('startDate', formData.startDate);
      eventData.append('startTime', formData.startTime);
      eventData.append('endDate', formData.endDate);
      eventData.append('endTime', formData.endTime);
      eventData.append('tags', formData.tags);
      
      if (selectedImage) {
        eventData.append('image', selectedImage);
      }

      const response = await eventsApi.createEvent(eventData);
      
      if (response.success) {
        toast({
          title: "Event Created",
          description: "Your event has been created successfully!",
        });
        navigate('/events');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating the event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <div className="flex-grow container mx-auto max-w-4xl px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-muted-foreground">Share your upcoming event with the community</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Enter a descriptive title" 
                    className="mt-1" 
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="What's this event about?" 
                    className="mt-1 min-h-32" 
                    required
                  />
                </div>
                
                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="Where will this event take place?" 
                    className="mt-1" 
                    required
                  />
                </div>
                
                {/* Date/Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <div className="mt-1">
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={formData.startDate} 
                        onChange={handleChange} 
                        className="w-full" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <div className="mt-1">
                      <Input 
                        id="startTime" 
                        type="time" 
                        value={formData.startTime} 
                        onChange={handleChange} 
                        className="w-full" 
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>End Date</Label>
                    <div className="mt-1">
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                        className="w-full" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <div className="mt-1">
                      <Input 
                        id="endTime" 
                        type="time" 
                        value={formData.endTime} 
                        onChange={handleChange} 
                        className="w-full" 
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={handleChange} 
                    placeholder="e.g. Workshop, Tech, Social (comma separated)" 
                    className="mt-1" 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
                
                {/* Image Upload */}
                <div>
                  <Label>Event Image</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto max-h-48 object-contain" 
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag & drop an image or click to browse
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('image')?.click()}
                      className="mt-2"
                    >
                      {imagePreview ? "Change Image" : "Select Image"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardFooter className="px-0 pb-0 pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/events')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateEvent; 
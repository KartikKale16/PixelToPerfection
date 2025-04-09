import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { eventsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeftIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag,
  Upload,
  Loader2,
  Save,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface Event {
  _id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  image: string;
  tags: string[];
  attendees: number;
  organizer: {
    _id: string;
    username: string;
    fullName: string;
  };
}

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);
  
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchEvent(id);
    }
  }, [id, isAuthenticated]);

  const fetchEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await eventsApi.getEvent(eventId);
      
      if (response.success && response.data) {
        const event = response.data;
        setOriginalEvent(event);
        
        // Convert event data to form format
        const startDate = new Date(event.startDateTime);
        const endDate = new Date(event.endDateTime);
        
        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: formatDateForInput(startDate),
          startTime: formatTimeForInput(startDate),
          endDate: formatDateForInput(endDate),
          endTime: formatTimeForInput(endDate),
          tags: event.tags ? event.tags.join(', ') : '',
        });
        
        // Set image preview
        setImagePreview(event.image);
      } else {
        toast({
          title: "Error",
          description: "Failed to load event. Please try again.",
          variant: "destructive",
        });
        navigate('/events/list');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: "Error",
        description: "Failed to load event details.",
        variant: "destructive",
      });
      navigate('/events/list');
    } finally {
      setIsLoading(false);
    }
  };

  // Format helpers
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  // Check if user is the organizer or admin
  const canEdit = () => {
    if (!user || !originalEvent) return false;
    return user.role === 'admin' || (originalEvent.organizer && originalEvent.organizer._id === user.id);
  };

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
    
    if (!canEdit()) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this event.",
        variant: "destructive",
      });
      return;
    }

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

      if (!id) throw new Error("Event ID is missing");
      
      const response = await eventsApi.updateEvent(id, eventData);
      
      if (response.success) {
        toast({
          title: "Event Updated",
          description: "Your event has been updated successfully!",
        });
        navigate(`/events/${id}`);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading event details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!canEdit()) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center p-4">
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
          <p className="text-gray-600 mb-6 text-center">
            You don't have permission to edit this event.
          </p>
          <Button onClick={() => navigate(`/events/${id}`)}>
            View Event Details
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-4xl">
        <button 
          onClick={() => navigate(`/events/${id}`)} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Event Details
        </button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
            <CardDescription>
              Update the details for your event
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to keep the current image
                  </p>
                </div>
              </div>
              
              <CardFooter className="px-0 pb-0 pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/events/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
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

export default EventEdit; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { eventsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeftIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserCircle, 
  Tag,
  Pencil,
  Loader2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setEvent(response.data);
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

  // Format date and time
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Check if user is the organizer or admin
  const canEdit = () => {
    if (!user || !event) return false;
    return user.role === 'admin' || (event.organizer && event.organizer._id === user.id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-6xl">
        <button 
          onClick={() => navigate('/events/list')} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Events
        </button>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-3 text-lg">Loading event details...</span>
          </div>
        ) : event ? (
          <div className="space-y-8">
            {/* Event Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/2">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full rounded-xl object-cover shadow-md max-h-96"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                
                <div className="flex items-center text-gray-600">
                  <UserCircle className="mr-2 h-5 w-5" />
                  <span>Organized by {event.organizer?.fullName || event.organizer?.username}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{formatEventDate(event.startDateTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>{formatEventTime(event.startDateTime)} - {formatEventTime(event.endDateTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="mr-2 h-5 w-5" />
                    <span>{event.attendees || 0} attendees</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {event.tags && event.tags.map(tag => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag size={12} />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button className="w-full">Register for Event</Button>
                  {canEdit() && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/events/edit/${event._id}`)}
                      className="flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Event Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">About this event</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Details could go here */}
            {/* For example: venue details, schedule, speakers, etc. */}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Event not found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events/list')}>Back to Events</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails; 
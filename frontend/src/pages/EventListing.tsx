import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { eventsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeftIcon, 
  CalendarPlusIcon, 
  SearchIcon,
  Filter,
  ChevronLeftIcon,
  ChevronRightIcon,
  Tag,
  MapPin,
  Clock,
  Calendar,
  Users,
  Loader2,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Interface for event data
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

const EventListing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [eventsPerPage] = useState(5);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch events from API
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchEvents();
  }, [isAuthenticated, activeFilter, currentPage]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Build query parameters based on filters
      const params: Record<string, string> = {
        limit: eventsPerPage.toString(),
        page: currentPage.toString(),
      };

      // Add sort parameter based on activeFilter
      if (activeFilter === 'upcoming') {
        params.sort = 'upcoming';
      } else if (activeFilter === 'past') {
        params.sort = 'past';
      }

      const response = await eventsApi.getAllEvents(params);
      
      if (response.success && response.data) {
        setEvents(response.data);
        setTotalEvents(response.count || 0);
      } else {
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;
    
    setIsDeleting(true);
    try {
      const response = await eventsApi.deleteEvent(deleteEventId);
      
      if (response.success) {
        toast({
          title: "Event Deleted",
          description: "The event has been deleted successfully.",
        });
        // Refresh events list
        fetchEvents();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the event.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteEventId(null);
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

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-7xl">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Event Management</h1>
            <Button 
              onClick={() => navigate('/events/create')}
              className="flex items-center gap-2"
            >
              <CalendarPlusIcon size={16} />
              <span>Add Event</span>
            </Button>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              onClick={() => {
                setActiveFilter('all');
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'upcoming' ? 'default' : 'outline'} 
              onClick={() => {
                setActiveFilter('upcoming');
                setCurrentPage(1);
              }}
            >
              Upcoming
            </Button>
            <Button 
              variant={activeFilter === 'past' ? 'default' : 'outline'} 
              onClick={() => {
                setActiveFilter('past');
                setCurrentPage(1);
              }}
            >
              Past
            </Button>
          </div>
        </div>

        {/* Events list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-3 text-lg">Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No events found</p>
            <Button onClick={() => navigate('/events/create')}>Create your first event</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map(event => (
              <Card key={event._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-grow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <h2 className="text-xl font-bold mb-2 md:mb-0">{event.title}</h2>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users size={14} className="mr-1" />
                          <span>{event.attendees || 0} attendees</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatEventDate(event.startDateTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-2" />
                          <span>{formatEventTime(event.startDateTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
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
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/events/${event._id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/events/edit/${event._id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setDeleteEventId(event._id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {totalEvents} events
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon size={16} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default EventListing; 
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, MapPin, Search, Filter, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { eventsApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Sample event data as fallback
const sampleEvents = [
  // Truncated for brevity - we'll use this as fallback if API fails
  {
    id: 1,
    title: "Annual Tech Hackathon",
    date: "October 15-17, 2025",
    time: "9:00 AM - 6:00 PM",
    description: "A 48-hour coding marathon where teams compete to build innovative solutions to real-world problems.",
    location: "Engineering Building, Room 301",
    tags: ["Competition", "Coding", "Teamwork"],
    featured: true,
    type: "upcoming",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  // ... more sample events can be added here
];

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

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const sort = activeTab === "upcoming" ? "upcoming" : "past";
        const response = await eventsApi.getAllEvents({ sort });
        
        if (response.success && response.data) {
          setEvents(response.data);
          
          // Extract all unique tags
          const tags = [...new Set(response.data.flatMap(event => event.tags))];
          setAllTags(tags);
        } else {
          toast({
            title: "Error",
            description: "Failed to load events. Using sample data instead.",
            variant: "destructive",
          });
          setEvents(sampleEvents);
          setAllTags([...new Set(sampleEvents.flatMap(event => event.tags))]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Using sample data instead.",
          variant: "destructive",
        });
        setEvents(sampleEvents);
        setAllTags([...new Set(sampleEvents.flatMap(event => event.tags))]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);
  
  // Filter events based on search term and selected tag
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "" || selectedTag === "all-tags" || 
      (event.tags && event.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
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

  // Event details component - reused for both dialog and drawer
  const EventDetails = ({ event }: { event: Event }) => (
    <div className="space-y-4">
      <div className="w-full h-60 overflow-hidden rounded-lg mb-4">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatEventDate(event.startDateTime)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <span>{formatEventTime(event.startDateTime)} - {formatEventTime(event.endDateTime)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </div>
      <p className="text-gray-700">{event.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {event.tags && event.tags.map((tag, tagIndex) => (
          <Badge key={tagIndex} variant="secondary" className="bg-secondary/80">
            {tag}
          </Badge>
        ))}
      </div>
      <Button className="w-full">Register Now</Button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">ACES Events</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our upcoming and past events designed to enhance your skills, 
              expand your network, and create memorable experiences.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full bg-white border-blue-100 focus:border-primary"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="flex-1 border-blue-100 bg-white">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Filter by tag" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-tags">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(searchTerm || selectedTag) && (
                    <Button 
                      variant="ghost" 
                      onClick={handleClearFilters}
                      className="flex-shrink-0 text-sm"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Tabs 
            defaultValue="upcoming" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg">Loading events...</span>
              </div>
            ) : (
              <>
                <TabsContent value="upcoming" className="mt-6">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 text-lg">No upcoming events found.</p>
                      {(searchTerm || selectedTag) && (
                        <Button 
                          variant="outline" 
                          onClick={handleClearFilters}
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map(event => (
                        <EventCard 
                          key={event._id}
                          event={event}
                          setOpenEventId={setOpenEventId}
                          isMobile={isMobile}
                          formatDate={formatEventDate}
                          formatTime={formatEventTime}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 text-lg">No past events found.</p>
                      {(searchTerm || selectedTag) && (
                        <Button 
                          variant="outline" 
                          onClick={handleClearFilters}
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map(event => (
                        <EventCard 
                          key={event._id}
                          event={event}
                          setOpenEventId={setOpenEventId}
                          isMobile={isMobile}
                          formatDate={formatEventDate}
                          formatTime={formatEventTime}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      {/* Event detail modals - display based on device type */}
      {filteredEvents.map(event => (
        <React.Fragment key={event._id}>
          {isMobile ? (
            <Drawer open={openEventId === event._id} onOpenChange={() => setOpenEventId(null)}>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle>{event.title}</DrawerTitle>
                  <DrawerDescription>Organized by {event.organizer?.fullName || event.organizer?.username}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <EventDetails event={event} />
                </div>
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={openEventId === event._id} onOpenChange={() => setOpenEventId(null)}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{event.title}</DialogTitle>
                </DialogHeader>
                <EventDetails event={event} />
              </DialogContent>
            </Dialog>
          )}
        </React.Fragment>
      ))}
      
      <Footer />
    </div>
  );
};

// Event card component
const EventCard = ({ 
  event, 
  setOpenEventId, 
  isMobile,
  formatDate,
  formatTime
}) => {
  const EventImage = () => (
    <div className="w-full h-48 overflow-hidden rounded-t-lg">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
      />
    </div>
  );

  const EventContent = () => (
    <>
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-1">{event.title}</h3>
        
        <div className="flex flex-col space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(event.startDateTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>{formatTime(event.startDateTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags && event.tags.map((tag, tagIndex) => (
            <Badge key={tagIndex} variant="secondary" className="bg-secondary/80">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => setOpenEventId(event._id)} 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow rounded-xl">
      <EventImage />
      <EventContent />
    </Card>
  );
};

export default Events;

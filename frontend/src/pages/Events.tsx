
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, MapPin, Search, Filter, X } from 'lucide-react';
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

// Sample event data
const allEvents = [
  // Upcoming events
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
  {
    id: 2,
    title: "Industry Expert Talk Series",
    date: "September 28, 2025",
    time: "2:00 PM - 4:00 PM",
    description: "Join us for an insightful talk by industry leaders sharing their experiences and the latest trends in technology.",
    location: "Virtual Event",
    tags: ["Workshop", "Learning"],
    featured: false,
    type: "upcoming",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  {
    id: 3,
    title: "Programming Workshop",
    date: "September 10, 2025",
    time: "3:00 PM - 5:30 PM",
    description: "Hands-on workshop on advanced programming concepts and their practical applications.",
    location: "Computer Lab 202",
    tags: ["Workshop", "Coding"],
    featured: false,
    type: "upcoming",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  {
    id: 4,
    title: "Tech Career Fair",
    date: "November 5, 2025",
    time: "10:00 AM - 4:00 PM",
    description: "Connect with tech companies and explore career opportunities in the field of computer engineering.",
    location: "University Center, Grand Hall",
    tags: ["Career", "Networking"],
    featured: true,
    type: "upcoming",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  
  // Past events
  {
    id: 5,
    title: "Web Development Bootcamp",
    date: "August 15-17, 2025",
    time: "9:00 AM - 5:00 PM",
    description: "An intensive 3-day bootcamp covering frontend and backend web development technologies.",
    location: "Innovation Lab, Room 105",
    tags: ["Workshop", "Coding", "Web Development"],
    featured: false,
    type: "past",
    image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  {
    id: 6,
    title: "Alumni Networking Night",
    date: "July 25, 2025",
    time: "6:00 PM - 9:00 PM",
    description: "An evening of networking with alumni working in various tech companies.",
    location: "University Center, Ballroom",
    tags: ["Networking", "Social"],
    featured: false,
    type: "past",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  {
    id: 7,
    title: "Artificial Intelligence Seminar",
    date: "June 12, 2025",
    time: "1:00 PM - 3:00 PM",
    description: "Learn about the latest advancements in AI and machine learning from field experts.",
    location: "Science Building, Auditorium",
    tags: ["Seminar", "AI", "Learning"],
    featured: false,
    type: "past",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
  {
    id: 8,
    title: "Spring Tech Fest",
    date: "April 20-22, 2025",
    time: "All Day",
    description: "Annual technology festival featuring competitions, workshops, and guest lectures.",
    location: "University Campus",
    tags: ["Festival", "Competition"],
    featured: true,
    type: "past",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  },
];

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [openEventId, setOpenEventId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Filter events based on search term, selected tag and active tab
  const filteredEvents = allEvents.filter(event => {
    const matchesTab = event.type === activeTab;
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "" || selectedTag === "all-tags" || event.tags.includes(selectedTag);
    
    return matchesTab && matchesSearch && matchesTag;
  });
  
  // Get unique tags from all events
  const allTags = [...new Set(allEvents.flatMap(event => event.tags))];

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
  };

  // Event details component - reused for both dialog and drawer
  const EventDetails = ({ event }) => (
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
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </div>
      <p className="text-gray-700">{event.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {event.tags.map((tag, tagIndex) => (
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
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 rounded-lg bg-blue-50 p-1">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Past Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {filteredEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      setOpenEventId={setOpenEventId} 
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-blue-50/50 rounded-lg">
                  <p className="text-gray-500">No upcoming events found matching your criteria.</p>
                  <Button variant="link" onClick={handleClearFilters}>Clear filters</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              {filteredEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      setOpenEventId={setOpenEventId}
                      isMobile={isMobile} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-blue-50/50 rounded-lg">
                  <p className="text-gray-500">No past events found matching your criteria.</p>
                  <Button variant="link" onClick={handleClearFilters}>Clear filters</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialogs for event details (desktop) */}
      {!isMobile && allEvents.map(event => (
        <Dialog key={event.id} open={openEventId === event.id} onOpenChange={() => setOpenEventId(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            </DialogHeader>
            <EventDetails event={event} />
          </DialogContent>
        </Dialog>
      ))}

      {/* Drawers for event details (mobile) */}
      {isMobile && allEvents.map(event => (
        <Drawer key={event.id} open={openEventId === event.id} onOpenChange={() => setOpenEventId(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl">{event.title}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <EventDetails event={event} />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
      
      <Footer />
    </div>
  );
};

// Event card component
const EventCard = ({ event, setOpenEventId, isMobile }) => {
  const EventImage = () => (
    <div 
      className="h-40 w-full overflow-hidden rounded-t-lg bg-blue-100"
      style={{ position: 'relative' }}
    >
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {event.featured && (
        <Badge variant="default" className="absolute top-2 right-2 bg-primary text-primary-foreground">
          Featured
        </Badge>
      )}
    </div>
  );

  return (
    <div onClick={() => setOpenEventId(event.id)}>
      {isMobile ? (
        <Card className="group h-full flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
          <EventImage />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{event.date}</span>
            </div>
          </CardHeader>
          <CardContent className="py-0 flex-grow">
            <p className="text-gray-700 line-clamp-2">{event.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {event.tags.slice(0, 2).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" className="bg-blue-50 text-blue-600 border border-blue-100">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border border-blue-100">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="group h-full flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
              <EventImage />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
              </CardHeader>
              <CardContent className="py-0 flex-grow">
                <p className="text-gray-700 line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {event.tags.slice(0, 2).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-blue-50 text-blue-600 border border-blue-100">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 2 && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border border-blue-100">
                      +{event.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start" className="w-80 p-0">
            <div className="p-4">
              <h4 className="font-semibold">{event.title}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="mr-2 h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{event.description}</p>
              <Button size="sm" variant="link" className="mt-2 p-0">Click to view more</Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default Events;

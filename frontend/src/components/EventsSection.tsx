
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const events = [
  {
    title: "Annual Tech Hackathon",
    date: "October 15-17, 2025",
    description: "A 48-hour coding marathon where teams compete to build innovative solutions to real-world problems.",
    location: "Engineering Building, Room 301",
    tags: ["Competition", "Coding", "Teamwork"],
    featured: true,
  },
  {
    title: "Industry Expert Talk Series",
    date: "September 28, 2025",
    description: "Join us for an insightful talk by industry leaders sharing their experiences and the latest trends in technology.",
    location: "Virtual Event",
    tags: ["Workshop", "Learning"],
    featured: false,
  },
  {
    title: "Programming Workshop",
    date: "September 10, 2025",
    description: "Hands-on workshop on advanced programming concepts and their practical applications.",
    location: "Computer Lab 202",
    tags: ["Workshop", "Coding"],
    featured: false,
  },
];

const EventsSection = () => {
  return (
    <section id="events" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Join us for exciting events, workshops, and competitions designed to enhance your skills and expand your network.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card key={index} className={`bg-white shadow-lg card-hover ${event.featured ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  {event.featured && (
                    <Badge variant="default" className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-secondary/80">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/events">
            <Button>View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;


import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Students collaborating on a project"
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Team meeting"
  },
  {
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Hackathon event"
  },
  {
    url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Students at workshop"
  },
  {
    url: "https://images.unsplash.com/photo-1531496731623-c51ec2a07171?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Tech presentation"
  },
  {
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    alt: "Club celebration"
  }
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h2>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Explore moments from our past events, workshops, and community activities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="inline-flex items-center">
            View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;


import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center hero-pattern overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-block bg-accent px-4 py-1 rounded-full text-accent-foreground font-medium text-sm mb-2">
              Driving Innovation in Computing
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="gradient-text">Association of</span><br />
              <span className="gradient-text">Computer Engineering</span><br />
              <span className="gradient-text">Students</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-xl">
              Empowering students through technology, innovation, and collaboration to build the future of computing
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="button-glow">
                Join Our Community
              </Button>
              <Button size="lg" variant="outline">
                Explore Events
              </Button>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -right-8 top-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
            <div className="absolute left-0 bottom-8 w-48 h-48 bg-blue-500/10 rounded-full filter blur-2xl"></div>
            
            <div className="relative bg-white shadow-xl rounded-2xl border border-gray-100 p-1 z-10">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&q=80" 
                alt="Students collaborating" 
                className="rounded-xl object-cover w-full h-96"
              />
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-6 w-48">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-sm">Active Members</span>
                </div>
                <div className="text-3xl font-bold mt-2 gradient-text">500+</div>
              </div>
              
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-500">Top-rated student organization</p>
              </div>
            </div>
          </div>
        </div>
        
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-500 hover:text-primary transition-colors"
        >
          <span className="text-sm mb-2">Learn More</span>
          <ArrowDown className="animate-bounce" size={20} />
        </a>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;

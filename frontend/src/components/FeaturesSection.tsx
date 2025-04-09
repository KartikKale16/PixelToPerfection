
import { Code, Users, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: "Technical Workshops",
    description: "Hands-on learning sessions on the latest technologies, programming languages, and tools used in the industry",
    icon: Code
  },
  {
    title: "Networking Events",
    description: "Connect with industry professionals, alumni, and fellow students to build valuable relationships",
    icon: Users
  },
  {
    title: "Academic Support",
    description: "Study groups, tutoring sessions, and resources to help you excel in your computer engineering courses",
    icon: BookOpen
  },
  {
    title: "Innovation Projects",
    description: "Collaborate on real-world projects that solve problems and build your portfolio for future opportunities",
    icon: Lightbulb
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="section-heading">What We Offer</h2>
          <p className="text-gray-600 mt-6">
            As a member of ACES, you'll have access to a variety of programs and resources designed to enhance your academic experience and prepare you for a successful career in tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
              <Button variant="link" className="text-primary p-0 flex items-center">
                Learn more
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

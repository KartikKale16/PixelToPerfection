
import { Award, Book, Users, TrendingUp, HeartHandshake, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: "Community",
    description: "Join a vibrant community of like-minded individuals passionate about computer engineering and technology."
  },
  {
    icon: Book,
    title: "Learning",
    description: "Expand your knowledge through workshops, seminars, and hands-on projects guided by industry experts."
  },
  {
    icon: Award,
    title: "Growth",
    description: "Develop technical and soft skills that will help you stand out in your academic and professional career."
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Advancement",
    description: "Access to exclusive job opportunities, internships, and career counseling sessions."
  },
  {
    icon: HeartHandshake,
    title: "Networking",
    description: "Connect with industry professionals, alumni, and peers to build lasting relationships."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Participate in hackathons and innovation challenges to apply your skills to real-world problems."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About ACES</h2>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            The Association of Computer Engineering Students (ACES) is a student-led organization dedicated to enhancing the academic and professional experience of computer engineering students through various technical and non-technical activities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-gray-600">
            To cultivate technical excellence and foster professional development among computer engineering students through innovative events, workshops, and networking opportunities.
          </p>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-gray-600">
            To be the premier student organization that bridges academic knowledge with industry practices, creating well-rounded computer engineering professionals ready to tackle real-world challenges.
          </p>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Benefits of Joining ACES</h3>
          <div className="section-divider"></div>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

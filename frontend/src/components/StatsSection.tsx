
import { Cpu, Users, Calendar, Trophy } from 'lucide-react';

const stats = [
  {
    number: '500+',
    label: 'Active Members',
    icon: Users,
    description: 'Students actively participating in our community'
  },
  {
    number: '50+',
    label: 'Annual Events',
    icon: Calendar,
    description: 'Workshops, competitions, and networking opportunities'
  },
  {
    number: '25+',
    label: 'Industry Partners',
    icon: Cpu,
    description: 'Connections with leading tech companies'
  },
  {
    number: '10+',
    label: 'Awards Won',
    icon: Trophy,
    description: 'Recognition for excellence in technology'
  }
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="mb-4 bg-accent rounded-full p-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="stat-number">{stat.number}</div>
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-gray-500 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

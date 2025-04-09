
import React from 'react';

const testimonials = [
  {
    quote: "Joining ACES was the best decision I made in college. The workshops and networking events directly helped me secure my dream internship at a top tech company.",
    name: "Alex Johnson",
    role: "Senior, Computer Engineering",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "The mentorship program connected me with industry professionals who guided me through my career path. I'm now working at a startup that I love!",
    name: "Taylor Kim",
    role: "Alumni, Class of 2023",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "As an international student, ACES helped me find a community and build connections that made my university experience so much better.",
    name: "Maria Rodriguez",
    role: "Junior, Computer Science",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="section-heading mb-16">What Our Members Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="mb-6">
                <svg className="h-8 w-8 text-primary/40" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.866 0-7 3.134-7 7v8h7c3.866 0 7-3.134 7-7v-1c0-3.866-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5v1c0 2.761-2.239 5-5 5H5v-6c0-2.761 2.239-5 5-5zm12-2c-3.866 0-7 3.134-7 7v8h7c3.866 0 7-3.134 7-7v-1c0-3.866-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5v1c0 2.761-2.239 5-5 5h-5v-6c0-2.761 2.239-5 5-5z" />
                </svg>
              </div>
              <p className="testimonial-text">{testimonial.quote}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const socialLinks = [
  { name: "Email", icon: Mail, link: "mailto:aces@example.edu" },
  { name: "Instagram", icon: Instagram, link: "#" },
  { name: "Twitter", icon: Twitter, link: "#" },
  { name: "Facebook", icon: Facebook, link: "#" },
  { name: "LinkedIn", icon: Linkedin, link: "#" },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="section-divider"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Have questions or want to collaborate? Reach out to us through our social media or send us a message.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <p className="flex items-center">
                <span className="text-gray-700">Department of Computer Engineering</span>
              </p>
              <p className="flex items-center">
                <span className="text-gray-700">University Campus, Example Street</span>
              </p>
              <p className="flex items-center">
                <span className="text-gray-700">City, State - 12345</span>
              </p>
              <p className="flex items-center">
                <span className="text-gray-700">aces@example.edu</span>
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-medium mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.link} 
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary/10 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5 text-gray-700" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">Send Us A Message</h3>
            <form className="space-y-4">
              <div>
                <Input type="text" placeholder="Your Name" className="bg-background" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" className="bg-background" />
              </div>
              <div>
                <Input type="text" placeholder="Subject" className="bg-background" />
              </div>
              <div>
                <Textarea placeholder="Your Message" className="bg-background" rows={5} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

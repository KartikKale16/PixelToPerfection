
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text mb-4">ACES</h3>
            <p className="text-gray-600">
              Association of Computer Engineering Students - Building the future of technology leaders.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="#about" className="text-gray-600 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/events" className="text-gray-600 hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="#gallery" className="text-gray-600 hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-gray-800">Get Involved</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-600 hover:text-primary transition-colors">Join ACES</Link></li>
              <li><Link to="/login" className="text-gray-600 hover:text-primary transition-colors">Member Login</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Partnerships</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Volunteer</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Donate</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-gray-800">Contact Us</h4>
            <address className="not-italic text-gray-600">
              <p>University Computer Engineering Building</p>
              <p>Room 201, Tech Lane</p>
              <p>University Campus, CA 94103</p>
              <p className="mt-2">Email: info@aces-university.org</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Association of Computer Engineering Students. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white">
                <i className="fas fa-train"></i>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white">Sri Lanka</span>
                <span className="font-heading font-bold text-lg text-primary">Railways</span>
              </div>
            </div>
            <p className="text-neutral-400 mb-4">
              Book your train tickets online and enjoy a scenic journey through the beautiful landscapes of Sri Lanka.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/#schedules">
                  <a className="text-neutral-400 hover:text-white transition-colors">Train Schedules</a>
                </Link>
              </li>
              <li>
                <Link href="/#booking">
                  <a className="text-neutral-400 hover:text-white transition-colors">Booking</a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-neutral-400 hover:text-white transition-colors">My Account</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">FAQs</a>
              </li>
            </ul>
          </div>
          
          {/* Popular Routes */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Popular Routes</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Colombo - Kandy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Kandy - Ella</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Colombo - Galle</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Colombo - Jaffna</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Colombo - Trincomalee</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                <span className="text-neutral-400">Sri Lanka Railways, P.O. Box 355, Colombo 10, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-primary mr-3"></i>
                <span className="text-neutral-400">+94 11 2421281</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-primary mr-3"></i>
                <span className="text-neutral-400">info@railway.gov.lk</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} Sri Lanka Railways. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm mt-4 md:mt-0">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

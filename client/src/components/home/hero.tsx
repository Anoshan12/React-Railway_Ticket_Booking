import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [, navigate] = useLocation();
  
  return (

<section className="bg-gradient-to-r from-gray-800 via-gray-400 to-gray-700 bg-blend-multiply text-white py-12 md:py-20">
<div className="container mx-auto px-4 ">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-black">
          Explore Sri Lanka By Train
            </h1>
            <p className="text-neutral-200 text-lg mb-6 text-black">
              Book your train tickets online and enjoy a scenic journey through the beautiful landscapes of Sri Lanka
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-6 h-auto"
                onClick={() => {
                  const bookingSection = document.getElementById("booking");
                  if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <i className="fas fa-ticket-alt mr-2"></i> Book Now
              </Button>
              <Button 
                variant="outline"
                className="bg-primary hover:bg-neutral-100 text-secondary font-medium px-6 py-6 h-auto border-0"
                onClick={() => {
                  const schedulesSection = document.getElementById("schedules");
                  if (schedulesSection) {
                    schedulesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <i className="fas fa-clock mr-2"></i> View Schedules
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src= "/images/banner.jpg"
              alt="Sri Lanka Railways train journey through scenic landscapes" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

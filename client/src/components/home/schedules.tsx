import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Train, Station } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Schedules() {
  const [, navigate] = useLocation();
  
  // Fetch all trains
  const { data: trains, isLoading: isLoadingTrains } = useQuery<Train[]>({
    queryKey: ['/api/trains'],
  });
  
  // Fetch all stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Helper function to get station name by ID
  const getStationName = (id: number): string => {
    return stations?.find(station => station.id === id)?.name || "Unknown Station";
  };
  
  // Helper function to calculate journey duration
  const calculateDuration = (departureTime: string, arrivalTime: string): string => {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
    
    let hourDiff = arrHours - depHours;
    let minuteDiff = arrMinutes - depMinutes;
    
    if (minuteDiff < 0) {
      minuteDiff += 60;
      hourDiff -= 1;
    }
    
    if (hourDiff < 0) {
      hourDiff += 24; // Assuming the journey doesn't span multiple days
    }
    
    return `${hourDiff}h ${minuteDiff}m`;
  };
  
  // Handle booking click
  const handleBookTrain = (train: Train) => {
    const today = new Date();
    navigate(`/booking?from=${train.departureStationId}&to=${train.arrivalStationId}&date=${today.toISOString()}&class=2&passengers=1`);
  };
  
  // Loading state
  if (isLoadingTrains || isLoadingStations) {
    return (
      <section id="schedules" className="py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-neutral-600">Loading schedules...</p>
        </div>
      </section>
    );
  }
  
  // Select a few popular trains to display
  const popularTrains = trains?.slice(0, 3) || [];
  
  return (
    <section id="schedules" className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Popular Train Schedules
          </h2>
          <p className="text-neutral-600">
            Find the most popular train journeys across Sri Lanka
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTrains.map((train) => (
            <Card key={train.id} className="overflow-hidden hover:shadow-md transition-shadow border border-neutral-200">
              <div className="bg-secondary-light text-white p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {getStationName(train.departureStationId)} - {getStationName(train.arrivalStationId)}
                  </span>
                  <span className="bg-accent text-secondary text-xs font-bold px-2 py-1 rounded">
                    {train.trainType}
                  </span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start">
                  {/* Departure */}
                  <div className="flex-1">
                    <p className="text-sm text-neutral-800">Departure</p>
                    <p className="text-xl font-bold">{train.departureTime}</p>
                    <p className="text-neutral-800">{getStationName(train.departureStationId)}</p>
                  </div>
                  
                  {/* Journey Time */}
                  <div className="px-4 text-center">
                    <div className="text-sm text-neutral-800 mb-1">Duration</div>
                    <div className="flex items-center justify-center text-neutral-600">
                    <div className="w-16 h-px bg-neutral-300 relative">

                    
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-neutral-400">
                        <i className="fas fa-train"></i>
                          
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium mt-1">
                      {calculateDuration(train.departureTime, train.arrivalTime)}
                    </div>
                  </div>
                  
                  {/* Arrival */}
                  <div className="flex-1 text-right">
                    <p className="text-sm text-neutral-800">Arrival</p>
                    <p className="text-xl font-bold">{train.arrivalTime}</p>
                    <p className="text-neutral-800">{getStationName(train.arrivalStationId)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
                  <div>
                    <span className="font-medium text-netural-500">LKR {train.price.toFixed(2)}</span>
                    <span className="text-sm text-neutral-500"> / person</span>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => handleBookTrain(train)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="#" className="text-primary hover:text-primary/90 font-medium inline-flex items-center">
            View All Schedules <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

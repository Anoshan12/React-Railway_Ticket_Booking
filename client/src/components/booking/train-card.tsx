import { Train } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrainCardProps {
  train: Train;
  fromStation: string;
  toStation: string;
  passengers: number;
  ticketClass: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TrainCard({
  train,
  fromStation,
  toStation,
  passengers,
  ticketClass,
  isSelected,
  onSelect,
}: TrainCardProps) {
  // Calculate total price based on class and passengers
  const calculatePrice = () => {
    // Apply multiplier based on class (1st class costs more, 3rd class costs less)
    const classMultiplier = ticketClass === 1 ? 1.5 : ticketClass === 3 ? 0.75 : 1;
    return train.price * passengers * classMultiplier;
  };
  
  // Calculate duration between departure and arrival time
  const calculateDuration = () => {
    const [depHours, depMinutes] = train.departureTime.split(':').map(Number);
    const [arrHours, arrMinutes] = train.arrivalTime.split(':').map(Number);
    
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
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 border",
        isSelected 
          ? "border-primary shadow-md" 
          : "border-neutral-200 hover:border-neutral-300"
      )}
      onClick={onSelect}
    >
      <div className={cn(
        "text-white p-4", 
        isSelected ? "bg-primary" : "bg-secondary-light"
      )}>
        <div className="flex justify-between items-center">
          <span className="font-medium">{train.name}</span>
          <Badge className="bg-accent text-secondary">
            {train.trainType}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start mb-6">
          {/* Departure */}
          <div className="flex-1">
            <p className="text-sm text-neutral-500">Departure</p>
            <p className="text-xl font-bold">{train.departureTime}</p>
            <p className="text-neutral-800">{fromStation}</p>
          </div>
          
          {/* Journey Time */}
          <div className="px-4 text-center">
            <div className="text-sm text-neutral-500 mb-1">Duration</div>
            <div className="flex items-center justify-center text-neutral-600">
              <div className="w-16 h-px bg-neutral-300 relative">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-neutral-400">
                  <i className="fas fa-train"></i>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium mt-1">{calculateDuration()}</div>
          </div>
          
          {/* Arrival */}
          <div className="flex-1 text-right">
            <p className="text-sm text-neutral-500">Arrival</p>
            <p className="text-xl font-bold">{train.arrivalTime}</p>
            <p className="text-neutral-800">{toStation}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="text-sm flex items-center space-x-2">
              <span className="text-neutral-500">Available seats:</span>
              <span className={cn(
                "font-medium",
                train.availableSeats < 10 ? "text-amber-600" : "text-green-600"
              )}>
                {train.availableSeats}
              </span>
            </div>
            <div className="text-sm flex items-center space-x-2">
              <span className="text-neutral-500">Class:</span>
              <span className="font-medium">
                {ticketClass === 1 ? "1st Class" : ticketClass === 2 ? "2nd Class" : "3rd Class"}
              </span>
            </div>
            <div className="text-sm flex items-center space-x-2">
              <span className="text-neutral-500">Passengers:</span>
              <span className="font-medium">{passengers}</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="text-sm text-neutral-500">Total Price</div>
            <div className="font-bold text-xl text-secondary">
              LKR {calculatePrice().toFixed(2)}
            </div>
            <div className="text-xs text-neutral-500">
              LKR {train.price.toFixed(2)} per ticket
            </div>
          </div>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="mt-4 pt-4 border-t border-neutral-200 text-center">
            <span className="text-primary font-medium flex items-center justify-center">
              <i className="fas fa-check-circle mr-2"></i> Selected
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

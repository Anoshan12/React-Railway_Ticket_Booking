import { useLocation } from "wouter";
import { formatCurrency, formatDuration, getClassLabel } from "@/lib/utils";
import { Train, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type TrainListProps = {
  trains: any[];
  selectedClass: string;
  passengers: number;
  departureDate: string;
  isLoading: boolean;
};

const TrainList = ({ 
  trains, 
  selectedClass, 
  passengers, 
  departureDate,
  isLoading 
}: TrainListProps) => {
  const [, navigate] = useLocation();

  const handleSelectTrain = (trainId: number) => {
    navigate(`/passenger-details?trainId=${trainId}&class=${selectedClass}&passengers=${passengers}&date=${departureDate}`);
  };

  const getPriceByClass = (train: any) => {
    switch (selectedClass.toLowerCase()) {
      case 'first':
        return train.firstClassPrice;
      case 'second':
        return train.secondClassPrice;
      case 'third':
        return train.thirdClassPrice;
      default:
        return train.secondClassPrice;
    }
  };

  const getSeatsByClass = (train: any) => {
    switch (selectedClass.toLowerCase()) {
      case 'first':
        return train.firstClassSeats;
      case 'second':
        return train.secondClassSeats;
      case 'third':
        return train.thirdClassSeats;
      default:
        return train.secondClassSeats;
    }
  };

  const getSeatStatusClass = (seats: number) => {
    if (seats <= 5) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {isLoading ? (
          <li className="px-4 py-4 sm:px-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading trains...</span>
            </div>
          </li>
        ) : trains.length === 0 ? (
          <li className="px-4 py-8 sm:px-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <Train className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No trains found</h3>
              <p className="mt-1 text-sm text-gray-500">Try different search criteria or another date.</p>
            </div>
          </li>
        ) : (
          trains.map((train) => (
            <li key={train.id}>
              <Card
                className="hover:bg-gray-50 cursor-pointer border-0 rounded-none"
                onClick={() => handleSelectTrain(train.id)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Train className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary">{train.name}</div>
                        <div className="text-sm text-gray-500">Train #{train.trainNumber}</div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Badge variant={train.status === 'active' ? 'default' : 'secondary'} className="bg-green-100 text-green-800 hover:bg-green-100">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          {train.departureTime} - {train.arrivalTime}{" "}
                          <span className="font-medium text-gray-900">
                            ({formatDuration(train.departureTime, train.arrivalTime)})
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p className="font-medium text-gray-900">
                        {formatCurrency(getPriceByClass(train))}
                      </p>
                      <p className="ml-1">per person</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">1st Class</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(train.firstClassPrice)}{" "}
                        <span className={`text-xs ${getSeatStatusClass(train.firstClassSeats)}`}>
                          ({train.firstClassSeats} seats)
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">2nd Class</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(train.secondClassPrice)}{" "}
                        <span className={`text-xs ${getSeatStatusClass(train.secondClassSeats)}`}>
                          ({train.secondClassSeats} seats)
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">3rd Class</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(train.thirdClassPrice)}{" "}
                        <span className={`text-xs ${getSeatStatusClass(train.thirdClassSeats)}`}>
                          ({train.thirdClassSeats} seats)
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TrainList;

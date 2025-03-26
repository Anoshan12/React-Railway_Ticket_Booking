import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Train, Station, BookingFormData, insertBookingSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import TrainCard from "@/components/booking/train-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function BookingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      from: Number(params.get("from")),
      to: Number(params.get("to")),
      date: params.get("date") ? new Date(params.get("date") as string) : new Date(),
      class: Number(params.get("class")) || 2,
      passengers: Number(params.get("passengers")) || 1
    };
  });
  
  const [selectedTrain, setSelectedTrain] = useState<{id: number, price: number} | null>(null);
  
  // Fetch stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Fetch trains by route
  const { data: trains, isLoading: isLoadingTrains } = useQuery<Train[]>({
    queryKey: ['/api/trains/search', searchParams.from, searchParams.to],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(
        `/api/trains/search?from=${queryKey[1]}&to=${queryKey[2]}`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to fetch trains');
      return res.json();
    },
    enabled: !!(searchParams.from && searchParams.to),
  });
  
  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      navigate(`/payment/${booking.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Get station names
  const fromStation = stations?.find(s => s.id === searchParams.from)?.name || "Loading...";
  const toStation = stations?.find(s => s.id === searchParams.to)?.name || "Loading...";
  
  // Handle booking creation
  const handleCreateBooking = () => {
    if (!selectedTrain || !user) return;
    
    const totalPrice = selectedTrain.price * searchParams.passengers * (4 - searchParams.class) / 2;
    
    const bookingData = {
      userId: user.id,
      trainId: selectedTrain.id,
      journeyDate: searchParams.date,
      passengers: searchParams.passengers,
      ticketClass: searchParams.class,
      totalPrice: totalPrice
    };
    
    createBookingMutation.mutate(bookingData);
  };
  
  // Loading states
  if (isLoadingStations || isLoadingTrains) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-neutral-100 py-10">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading trains...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-100 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Search Summary */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-4">
                Available Trains
              </h1>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center text-neutral-600 text-sm mb-1">
                        <span>{format(searchParams.date, "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="font-semibold text-lg text-neutral-800">{fromStation}</span>
                        </div>
                        <div className="text-neutral-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-lg text-neutral-800">{toStation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-neutral-600">Class</div>
                        <div className="font-medium">{searchParams.class === 1 ? "1st Class" : searchParams.class === 2 ? "2nd Class" : "3rd Class"}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-neutral-600">Passengers</div>
                        <div className="font-medium">{searchParams.passengers}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="text-primary border-primary hover:bg-primary/10"
                        onClick={() => navigate("/")}
                      >
                        Modify Search
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Train List */}
            <div className="space-y-4">
              {trains && trains.length > 0 ? (
                trains.map(train => (
                  <TrainCard 
                    key={train.id}
                    train={train}
                    fromStation={fromStation}
                    toStation={toStation}
                    passengers={searchParams.passengers}
                    ticketClass={searchParams.class}
                    isSelected={selectedTrain?.id === train.id}
                    onSelect={() => setSelectedTrain({ id: train.id, price: train.price })}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium text-neutral-800 mb-2">No Trains Available</h3>
                    <p className="text-neutral-600 mb-4">
                      There are no trains available for the selected route and date.
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Back to Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Booking Action */}
            {selectedTrain && (
              <div className="mt-8 flex justify-end">
                <Button 
                  className="bg-primary hover:bg-primary/90 px-8" 
                  size="lg"
                  onClick={handleCreateBooking}
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

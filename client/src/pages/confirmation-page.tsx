import { useRef } from "react";
import { useLocation, useParams } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle, Printer, Download, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Booking, Train, Station, User } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const [, navigate] = useLocation();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Fetch booking details
  const { data: booking, isLoading: isLoadingBooking } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
  });
  
  // Fetch train details if booking is loaded
  const { data: train, isLoading: isLoadingTrain } = useQuery<Train>({
    queryKey: [`/api/trains/${booking?.trainId}`],
    enabled: !!booking,
  });
  
  // Fetch stations if train is loaded
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
    enabled: !!train,
  });
  
  // Fetch user details if booking is loaded
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/user`],
  });
  
  // Handle print ticket
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && ticketRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sri Lanka Railways Ticket</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                color: #333;
              }
              .ticket {
                border: 2px solid #124559;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
              }
              .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                margin-right: auto;
              }
              .ticket-number {
                font-size: 14px;
              }
              .section {
                margin-bottom: 15px;
              }
              .title {
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
              }
              .value {
                font-weight: bold;
              }
              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }
              .total {
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #eee;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
              }
              .qr {
                margin-top: 20px;
                text-align: center;
              }
              .qr img {
                max-width: 120px;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            ${ticketRef.current.outerHTML}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">Print Ticket</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  // Loading state
  if (isLoadingBooking || isLoadingTrain || isLoadingStations || isLoadingUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-neutral-100 py-10">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading ticket details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state - booking not found
  if (!booking || !train || !stations || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-neutral-100 py-10">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Booking Not Found</h1>
            <p className="text-neutral-600 mb-6">We couldn't find the booking you're looking for.</p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get station names
  const fromStation = stations.find(s => s.id === train.departureStationId)?.name || "Unknown";
  const toStation = stations.find(s => s.id === train.arrivalStationId)?.name || "Unknown";
  const journeyDate = new Date(booking.journeyDate);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-100 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-green-800 font-medium mb-1">Booking Confirmed!</h2>
                <p className="text-green-700 text-sm">
                  Your train ticket has been successfully booked and paid for. You can print your ticket or find it in your bookings.
                </p>
              </div>
            </div>
            
            {/* Ticket */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-heading font-bold text-secondary">
                  Your E-Ticket
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div ref={ticketRef} className="ticket">
                  {/* Ticket Header */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 10h18"></path>
                          <path d="M3 14h18"></path>
                          <path d="M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"></path>
                          <path d="M10 6v12"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="font-heading font-bold text-lg text-secondary">Sri Lanka</span>
                        <span className="font-heading font-bold text-lg text-primary">Railways</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">Ticket Number</div>
                      <div className="font-mono font-medium">{booking.ticketNumber}</div>
                    </div>
                  </div>
                  
                  {/* Passenger Info */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Passenger Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-neutral-500">Name</div>
                        <div className="font-medium">{user.firstName || ''} {user.lastName || user.username}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Passengers</div>
                        <div className="font-medium">{booking.passengers} {booking.passengers === 1 ? 'Person' : 'People'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Journey Details */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Journey Details</h3>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="text-sm text-neutral-500 mb-1">Date</div>
                          <div className="font-medium">{format(journeyDate, "EEEE, MMMM d, yyyy")}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-neutral-500 mb-1">Train</div>
                          <div className="font-medium">{train.name}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-neutral-500 mb-1">Class</div>
                          <div className="font-medium">{booking.ticketClass === 1 ? "1st Class" : booking.ticketClass === 2 ? "2nd Class" : "3rd Class"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        {/* Departure */}
                        <div className="flex-1">
                          <div className="text-sm text-neutral-500 mb-1">Departure</div>
                          <div className="text-xl font-bold">{train.departureTime}</div>
                          <div className="text-neutral-800">{fromStation}</div>
                        </div>
                        
                        {/* Journey Time */}
                        <div className="px-4 text-center">
                          <div className="text-sm text-neutral-500 mb-1">Duration</div>
                          <div className="flex items-center justify-center text-neutral-600">
                            <div className="w-16 h-px bg-neutral-300 relative">
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-neutral-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 10h18"></path>
                                  <path d="M3 14h18"></path>
                                  <path d="M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"></path>
                                  <path d="M10 6v12"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium mt-1">
                            {calculateDuration(train.departureTime, train.arrivalTime)}
                          </div>
                        </div>
                        
                        {/* Arrival */}
                        <div className="flex-1 text-right">
                          <div className="text-sm text-neutral-500 mb-1">Arrival</div>
                          <div className="text-xl font-bold">{train.arrivalTime}</div>
                          <div className="text-neutral-800">{toStation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Payment Details</h3>
                    <div className="border-t border-dashed border-neutral-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-neutral-600">Ticket Price × {booking.passengers}</span>
                        <span className="font-medium">LKR {(booking.totalPrice / booking.passengers).toFixed(2)} × {booking.passengers}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg mt-4">
                        <span>Total Amount</span>
                        <span className="text-primary">LKR {booking.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Ticket
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
            
            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/profile")}>
                View My Bookings
              </Button>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                Book Another Ticket
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper function to calculate duration between two time strings (HH:MM)
function calculateDuration(departureTime: string, arrivalTime: string): string {
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
}

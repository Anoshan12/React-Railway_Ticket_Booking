import { useState } from "react";
import AdminLayout from "@/components/admin/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Booking, Train, Station, User } from "@shared/schema";
import { Loader2, Search, FileText, Calendar, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  // Fetch trains
  const { data: trains, isLoading: isLoadingTrains } = useQuery<Train[]>({
    queryKey: ['/api/trains'],
  });
  
  // Fetch stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Open booking details dialog
  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  
  // Get train details
  const getTrainInfo = (trainId: number) => {
    const train = trains?.find(t => t.id === trainId);
    if (!train) return { name: "Unknown", from: "Unknown", to: "Unknown" };
    
    const fromStation = stations?.find(s => s.id === train.departureStationId)?.name || "Unknown";
    const toStation = stations?.find(s => s.id === train.arrivalStationId)?.name || "Unknown";
    
    return {
      name: train.name,
      from: fromStation,
      to: toStation,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
    };
  };
  
  // Get user details
  const getUserInfo = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    if (!user) return { username: "Unknown" };
    
    return {
      username: user.username,
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    };
  };
  
  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const trainInfo = getTrainInfo(booking.trainId);
    const userInfo = getUserInfo(booking.userId);
    
    // Apply status filter
    if (filterStatus !== "all" && booking.paymentStatus !== filterStatus) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const ticketNumber = booking.ticketNumber.toLowerCase();
      const userName = userInfo.username.toLowerCase();
      const trainName = trainInfo.name.toLowerCase();
      const route = `${trainInfo.from} to ${trainInfo.to}`.toLowerCase();
      
      return (
        ticketNumber.includes(query) ||
        userName.includes(query) ||
        trainName.includes(query) ||
        route.includes(query)
      );
    }
    
    return true;
  }) || [];
  
  // Loading state
  if (isLoadingBookings || isLoadingTrains || isLoadingStations || isLoadingUsers) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading bookings...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-secondary mb-1">Booking Management</h1>
          <p className="text-neutral-500">View and manage all train bookings</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Total Bookings</div>
                  <div className="text-2xl font-bold">{bookings?.length || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Completed</div>
                  <div className="text-2xl font-bold">
                    {bookings?.filter(b => b.paymentStatus === 'completed').length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Pending</div>
                  <div className="text-2xl font-bold">
                    {bookings?.filter(b => b.paymentStatus === 'pending').length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Today's Bookings</div>
                  <div className="text-2xl font-bold">
                    {bookings?.filter(b => {
                      const today = new Date();
                      const bookingDate = new Date(b.bookingDate);
                      return (
                        bookingDate.getDate() === today.getDate() &&
                        bookingDate.getMonth() === today.getMonth() &&
                        bookingDate.getFullYear() === today.getFullYear()
                      );
                    }).length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input 
                  placeholder="Search by ticket number, user, or train..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              Showing {filteredBookings.length} of {bookings?.length || 0} bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Journey Date</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const trainInfo = getTrainInfo(booking.trainId);
                    const userInfo = getUserInfo(booking.userId);
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.ticketNumber}</TableCell>
                        <TableCell>{userInfo.username}</TableCell>
                        <TableCell>
                          <div>
                            <div>{trainInfo.name}</div>
                            <div className="text-xs text-neutral-500">
                              {trainInfo.from} to {trainInfo.to}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(booking.journeyDate), "PP")}</TableCell>
                        <TableCell>{booking.passengers}</TableCell>
                        <TableCell>LKR {booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBookingDetails(booking)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                      No bookings found with the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Ticket #{selectedBooking.ticketNumber}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full text-secondary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Passenger Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-neutral-500">Name</div>
                        <div className="font-medium">{getUserInfo(selectedBooking.userId).name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Email</div>
                        <div className="font-medium">{getUserInfo(selectedBooking.userId).email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Passengers</div>
                        <div className="font-medium">{selectedBooking.passengers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Class</div>
                        <div className="font-medium">
                          {selectedBooking.ticketClass === 1 ? "1st Class" : 
                           selectedBooking.ticketClass === 2 ? "2nd Class" : "3rd Class"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Journey Info */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <i className="fas fa-train text-base"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Journey Information</h3>
                    <div className="mt-2 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-neutral-500">Train</div>
                          <div className="font-medium">{getTrainInfo(selectedBooking.trainId).name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-500">Journey Date</div>
                          <div className="font-medium">{format(new Date(selectedBooking.journeyDate), "PPP")}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start pt-2">
                        {/* Departure */}
                        <div className="flex-1">
                          <div className="text-sm text-neutral-500">From</div>
                          <div className="font-medium">{getTrainInfo(selectedBooking.trainId).from}</div>
                          <div className="text-neutral-800">{getTrainInfo(selectedBooking.trainId).departureTime}</div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="px-4 py-2">
                          <div className="w-16 h-px bg-neutral-300 relative">
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-neutral-400">
                              <i className="fas fa-train text-xs"></i>
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrival */}
                        <div className="flex-1 text-right">
                          <div className="text-sm text-neutral-500">To</div>
                          <div className="font-medium">{getTrainInfo(selectedBooking.trainId).to}</div>
                          <div className="text-neutral-800">{getTrainInfo(selectedBooking.trainId).arrivalTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Info */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <i className="fas fa-credit-card text-base"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Payment Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-neutral-500">Booking Date</div>
                        <div className="font-medium">{format(new Date(selectedBooking.bookingDate), "PPP")}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Status</div>
                        <div>
                          <Badge
                            className={
                              selectedBooking.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Total Amount</div>
                        <div className="font-medium text-lg text-primary">LKR {selectedBooking.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button asChild>
                  <DialogClose>Close</DialogClose>
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.open(`/confirmation/${selectedBooking.id}`, '_blank')}
                >
                  View Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}

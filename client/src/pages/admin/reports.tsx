import { useState } from "react";
import AdminLayout from "@/components/admin/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Booking, Train, Station, User } from "@shared/schema";
import { Loader2, BarChart, PieChart, LineChart, Download, Calendar, CalendarRange } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Fetch all bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  // Fetch all trains
  const { data: trains, isLoading: isLoadingTrains } = useQuery<Train[]>({
    queryKey: ['/api/trains'],
  });
  
  // Fetch all stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Function to get date range based on selected time range
  const getDateRange = () => {
    const today = new Date();
    
    switch (timeRange) {
      case "week":
        return { start: subDays(today, 7), end: today };
      case "month":
        return { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) };
      case "quarter":
        // 3 months
        return { start: subMonths(today, 3), end: today };
      case "year":
        // 12 months
        return { start: subMonths(today, 12), end: today };
      default:
        return { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) };
    }
  };
  
  // Filter bookings based on date range
  const getFilteredBookings = () => {
    if (!bookings) return [];
    
    const { start, end } = getDateRange();
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return isWithinInterval(bookingDate, { start, end });
    });
  };
  
  // Get revenue data for the chart
  const getRevenueData = () => {
    const filteredBookings = getFilteredBookings();
    const daysMap = new Map();
    
    // Initialize days
    const { start, end } = getDateRange();
    let current = new Date(start);
    while (current <= end) {
      const dateKey = format(current, "yyyy-MM-dd");
      daysMap.set(dateKey, 0);
      current.setDate(current.getDate() + 1);
    }
    
    // Populate revenue by date
    filteredBookings.forEach(booking => {
      const dateKey = format(new Date(booking.bookingDate), "yyyy-MM-dd");
      if (daysMap.has(dateKey)) {
        daysMap.set(dateKey, daysMap.get(dateKey) + booking.totalPrice);
      }
    });
    
    // Convert to array for chart
    return Array.from(daysMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  };
  
  // Get popular routes based on bookings
  const getPopularRoutes = () => {
    if (!bookings || !trains || !stations) return [];
    
    const filteredBookings = getFilteredBookings();
    const routeMap = new Map();
    
    filteredBookings.forEach(booking => {
      const train = trains.find(t => t.id === booking.trainId);
      if (train) {
        const fromStation = stations.find(s => s.id === train.departureStationId)?.name || "Unknown";
        const toStation = stations.find(s => s.id === train.arrivalStationId)?.name || "Unknown";
        const routeKey = `${fromStation} to ${toStation}`;
        
        if (routeMap.has(routeKey)) {
          const current = routeMap.get(routeKey);
          routeMap.set(routeKey, {
            count: current.count + 1,
            revenue: current.revenue + booking.totalPrice,
          });
        } else {
          routeMap.set(routeKey, {
            count: 1,
            revenue: booking.totalPrice,
          });
        }
      }
    });
    
    // Convert to array and sort by count
    return Array.from(routeMap)
      .map(([route, data]) => ({
        route,
        ...data,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 routes
  };
  
  // Get booking distribution by class
  const getClassDistribution = () => {
    if (!bookings) return [];
    
    const filteredBookings = getFilteredBookings();
    const classMap = new Map();
    
    // Initialize classes
    classMap.set("1st Class", 0);
    classMap.set("2nd Class", 0);
    classMap.set("3rd Class", 0);
    
    // Count bookings by class
    filteredBookings.forEach(booking => {
      const className = booking.ticketClass === 1 ? "1st Class" : 
                       booking.ticketClass === 2 ? "2nd Class" : "3rd Class";
      
      classMap.set(className, classMap.get(className) + 1);
    });
    
    // Convert to array for chart
    return Array.from(classMap).map(([className, count]) => ({
      className,
      count,
    }));
  };
  
  // Get booking status distribution
  const getStatusDistribution = () => {
    if (!bookings) return [];
    
    const filteredBookings = getFilteredBookings();
    const statusMap = new Map();
    
    // Initialize statuses
    statusMap.set("Completed", 0);
    statusMap.set("Pending", 0);
    
    // Count bookings by status
    filteredBookings.forEach(booking => {
      const status = booking.paymentStatus === "completed" ? "Completed" : "Pending";
      statusMap.set(status, statusMap.get(status) + 1);
    });
    
    // Convert to array for chart
    return Array.from(statusMap).map(([status, count]) => ({
      status,
      count,
    }));
  };
  
  // Change month for month view
  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };
  
  // Get revenue summary
  const getRevenueSummary = () => {
    const filteredBookings = getFilteredBookings();
    
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const totalBookings = filteredBookings.length;
    const completedBookings = filteredBookings.filter(b => b.paymentStatus === "completed").length;
    const pendingBookings = filteredBookings.filter(b => b.paymentStatus === "pending").length;
    
    return {
      totalRevenue,
      totalBookings,
      completedBookings,
      pendingBookings,
      avgTicketPrice: totalBookings > 0 ? totalRevenue / totalBookings : 0,
    };
  };
  
  // Loading state
  if (isLoadingBookings || isLoadingTrains || isLoadingStations || isLoadingUsers) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading report data...</span>
        </div>
      </AdminLayout>
    );
  }
  
  // Get data for charts and tables
  const revenueSummary = getRevenueSummary();
  const popularRoutes = getPopularRoutes();
  const { start, end } = getDateRange();
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-secondary mb-1">Reports & Analytics</h1>
          <p className="text-neutral-500">View booking statistics and revenue reports</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            
            {timeRange === "month" && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
                <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {/* Date Range Display */}
        <div className="text-sm text-neutral-500 flex items-center gap-1">
          <CalendarRange className="h-4 w-4" />
          <span>
            {timeRange === "month" 
              ? `Report for ${format(currentMonth, "MMMM yyyy")}`
              : `Report for ${format(start, "PP")} - ${format(end, "PP")}`}
          </span>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-secondary">LKR {revenueSummary.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <BarChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-secondary">{revenueSummary.totalBookings}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <LineChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Avg. Ticket Price</p>
                  <p className="text-2xl font-bold text-secondary">LKR {revenueSummary.avgTicketPrice.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Completed Bookings</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-secondary">{revenueSummary.completedBookings}</p>
                    <p className="text-sm text-neutral-500">
                      {revenueSummary.totalBookings > 0 
                        ? `(${((revenueSummary.completedBookings / revenueSummary.totalBookings) * 100).toFixed(1)}%)`
                        : "(0%)"}
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Report Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="popular">Popular Routes</TabsTrigger>
            <TabsTrigger value="breakdown">Booking Breakdown</TabsTrigger>
          </TabsList>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Daily revenue for the selected time period</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {/* Revenue Chart - Using a simple representation here */}
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-end gap-1">
                    {getRevenueData().map((data, index) => (
                      <div 
                        key={index} 
                        className="group relative flex-1 bg-primary/80 hover:bg-primary transition-all rounded-t"
                        style={{ 
                          height: `${Math.max(5, (data.revenue / Math.max(...getRevenueData().map(d => d.revenue))) * 100)}%`,
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          <div>{format(new Date(data.date), "MMM d")}</div>
                          <div className="font-semibold">LKR {data.revenue.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-1 text-xs text-neutral-500">
                    {getRevenueData().slice(0, 7).map((data, index) => (
                      <div key={index} className="text-center overflow-hidden">
                        {format(new Date(data.date), "EEE")}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>Key revenue metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Status</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-neutral-500">Completed</div>
                          <div className="font-medium">{revenueSummary.completedBookings} bookings</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-500">Revenue</div>
                          <div className="font-medium text-green-600">
                            LKR {getFilteredBookings()
                              .filter(b => b.paymentStatus === "completed")
                              .reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-neutral-500">Pending</div>
                          <div className="font-medium">{revenueSummary.pendingBookings} bookings</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-500">Potential Revenue</div>
                          <div className="font-medium text-amber-600">
                            LKR {getFilteredBookings()
                              .filter(b => b.paymentStatus === "pending")
                              .reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Class Distribution</h3>
                    <div className="space-y-4">
                      {getClassDistribution().map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.className}</span>
                            <span className="font-medium">
                              {item.count} ({getFilteredBookings().length > 0 
                                ? ((item.count / getFilteredBookings().length) * 100).toFixed(1) 
                                : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${getFilteredBookings().length > 0 
                                  ? (item.count / getFilteredBookings().length) * 100 
                                  : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Popular Routes Tab */}
          <TabsContent value="popular" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Routes</CardTitle>
                <CardDescription>Most popular train routes based on bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {popularRoutes.length > 0 ? (
                    popularRoutes.map((route, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3">
                              {index + 1}
                            </div>
                            <div className="font-medium">{route.route}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{route.count} bookings</div>
                            <div className="text-sm text-neutral-500">LKR {route.revenue.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${(route.count / popularRoutes[0].count) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No booking data available for the selected period.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Busiest Days</CardTitle>
                  <CardDescription>Days with the highest number of bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {getFilteredBookings().length > 0 ? (
                    <div className="space-y-4">
                      {Array.from(
                        getFilteredBookings().reduce((acc, booking) => {
                          const day = format(new Date(booking.bookingDate), "EEEE");
                          acc.set(day, (acc.get(day) || 0) + 1);
                          return acc;
                        }, new Map())
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([day, count], index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                              <span>{day}</span>
                            </div>
                            <span className="font-medium">{count} bookings</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-neutral-500">
                      No booking data available.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Passengers</CardTitle>
                  <CardDescription>Average number of passengers per booking</CardDescription>
                </CardHeader>
                <CardContent>
                  {getFilteredBookings().length > 0 ? (
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-primary">
                        {(getFilteredBookings().reduce((sum, b) => sum + b.passengers, 0) / getFilteredBookings().length).toFixed(1)}
                      </div>
                      <div className="text-neutral-500 mt-2">Passengers per booking</div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-neutral-500">
                      No booking data available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Booking Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                  <CardDescription>Distribution of booking payment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueSummary.totalBookings > 0 ? (
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block">
                            {((revenueSummary.completedBookings / revenueSummary.totalBookings) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-100">
                        <div 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500" 
                          style={{ width: `${(revenueSummary.completedBookings / revenueSummary.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block">
                            {((revenueSummary.pendingBookings / revenueSummary.totalBookings) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-100">
                        <div 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500" 
                          style={{ width: `${(revenueSummary.pendingBookings / revenueSummary.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No booking data available for the selected period.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Booking Class Distribution</CardTitle>
                  <CardDescription>Distribution of bookings by train class</CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueSummary.totalBookings > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-4">
                        {getClassDistribution().map((item, index) => (
                          <div key={index} className="text-center">
                            <div 
                              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg"
                              style={{ 
                                backgroundColor: index === 0 ? '#124559' : index === 1 ? '#D71921' : '#FFC107',
                                fontSize: `${Math.max(14, 16 + (item.count / getFilteredBookings().length) * 10)}px`
                              }}
                            >
                              {((item.count / getFilteredBookings().length) * 100).toFixed(0)}%
                            </div>
                            <div className="mt-2 font-medium">{item.className}</div>
                            <div className="text-sm text-neutral-500">{item.count} bookings</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No booking data available for the selected period.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Booking patterns over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {getFilteredBookings().length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Booking Stats Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="text-sm text-neutral-500">Total Bookings</div>
                          <div className="text-xl font-bold">{revenueSummary.totalBookings}</div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="text-sm text-neutral-500">Total Passengers</div>
                          <div className="text-xl font-bold">
                            {getFilteredBookings().reduce((sum, b) => sum + b.passengers, 0)}
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="text-sm text-neutral-500">Avg. Passengers</div>
                          <div className="text-xl font-bold">
                            {(getFilteredBookings().reduce((sum, b) => sum + b.passengers, 0) / getFilteredBookings().length).toFixed(1)}
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="text-sm text-neutral-500">Avg. Ticket Price</div>
                          <div className="text-xl font-bold">LKR {revenueSummary.avgTicketPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Most Active Users</h3>
                      <div className="space-y-3">
                        {Array.from(
                          getFilteredBookings().reduce((acc, booking) => {
                            acc.set(booking.userId, (acc.get(booking.userId) || 0) + 1);
                            return acc;
                          }, new Map())
                        )
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([userId, count], index) => {
                            const user = users?.find(u => u.id === userId);
                            return (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                                    {user?.username.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {user?.firstName && user?.lastName 
                                        ? `${user.firstName} ${user.lastName}` 
                                        : user?.username || "Unknown User"}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                      {user?.email || ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">{count} bookings</div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No booking data available for the selected period.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

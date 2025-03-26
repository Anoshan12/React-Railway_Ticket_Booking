import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Train, CreditCard, CalendarClock, TrendingUp, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

import { User, Booking, Train as TrainType } from "@shared/schema";

export default function AdminDashboard() {
  // Fetch all users
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Fetch all bookings
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  // Fetch all trains
  const { data: trains } = useQuery<TrainType[]>({
    queryKey: ['/api/trains'],
  });
  
  // Calculate metrics
  const totalUsers = users?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalTrains = trains?.length || 0;
  
  // Calculate revenue
  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) || 0;
  
  // Calculate stats
  const pendingBookings = bookings?.filter(booking => booking.paymentStatus === 'pending').length || 0;
  const completedBookings = bookings?.filter(booking => booking.paymentStatus === 'completed').length || 0;
  
  // Generate monthly booking data for chart (mock data for demonstration)
  const recentlyRegisteredUsers = users?.slice().sort((a, b) => b.id - a.id).slice(0, 5) || [];
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-secondary mb-1">Admin Dashboard</h1>
          <p className="text-neutral-500">Overview of Sri Lanka Railways booking system</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-xs text-green-600">
                <ChevronUpIcon className="h-3 w-3 mr-1" />
                <span>12% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Bookings Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Bookings</p>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-xs text-green-600">
                <ChevronUpIcon className="h-3 w-3 mr-1" />
                <span>8% from last week</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Trains Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Active Trains</p>
                  <p className="text-2xl font-bold">{totalTrains}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Train className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-xs text-neutral-500">
                <span>No change</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                  <p className="text-2xl font-bold">LKR {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-xs text-green-600">
                <ChevronUpIcon className="h-3 w-3 mr-1" />
                <span>18% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
              <CardDescription>Overview of booking statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pending Payments</p>
                    <p className="text-2xl font-bold">{pendingBookings}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium">Completed Payments</p>
                    <p className="text-2xl font-bold">{completedBookings}</p>
                  </div>
                </div>
                
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{totalBookings > 0 ? ((pendingBookings / totalBookings) * 100).toFixed(1) : 0}% Pending</span>
                  <span>{totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0}% Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Registered Users</CardTitle>
              <CardDescription>New users who recently joined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyRegisteredUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {`${user.username.charAt(0).toUpperCase()}`}
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName || user.username} {user.lastName || ''}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500">ID: {user.id}</span>
                    </div>
                  </div>
                ))}
                
                {recentlyRegisteredUsers.length === 0 && (
                  <div className="text-center py-6 text-neutral-500">
                    No users have registered yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest train bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Train</th>
                    <th className="px-6 py-3">Journey Date</th>
                    <th className="px-6 py-3">Passengers</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.slice(0, 5).map(booking => {
                    const train = trains?.find(t => t.id === booking.trainId);
                    const user = users?.find(u => u.id === booking.userId);
                    
                    return (
                      <tr key={booking.id} className="border-b">
                        <td className="px-6 py-4 font-medium">{booking.id}</td>
                        <td className="px-6 py-4">{user?.username || 'Unknown'}</td>
                        <td className="px-6 py-4">{train?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">{new Date(booking.journeyDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{booking.passengers}</td>
                        <td className="px-6 py-4">LKR {booking.totalPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {(!bookings || bookings.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-neutral-500">
                        No bookings available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

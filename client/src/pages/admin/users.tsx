import { useState } from "react";
import AdminLayout from "@/components/admin/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Booking, User } from "@shared/schema";
import { Loader2, User as UserIcon, Search, Calendar, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Fetch bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  // Open user details dialog
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
  };
  
  // Filter users by search query
  const filteredUsers = users?.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const username = user.username.toLowerCase();
    const email = user.email.toLowerCase();
    const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    
    return username.includes(query) || email.includes(query) || name.includes(query);
  }) || [];
  
  // Get user's bookings
  const getUserBookings = (userId: number) => {
    return bookings?.filter(booking => booking.userId === userId) || [];
  };
  
  // Get user's total spent
  const getUserTotalSpent = (userId: number) => {
    return getUserBookings(userId).reduce((total, booking) => total + booking.totalPrice, 0);
  };
  
  // Loading state
  if (isLoadingUsers || isLoadingBookings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading users...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-secondary mb-1">User Management</h1>
          <p className="text-neutral-500">View and manage all registered users</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Total Users</div>
                  <div className="text-2xl font-bold">{users?.length || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Admins</div>
                  <div className="text-2xl font-bold">
                    {users?.filter(u => u.isAdmin).length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Regular Users</div>
                  <div className="text-2xl font-bold">
                    {users?.filter(u => !u.isAdmin).length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500">Most Active</div>
                  <div className="text-2xl font-bold truncate">
                    {users && bookings && users.length > 0
                      ? users.sort((a, b) => 
                          getUserBookings(b.id).length - getUserBookings(a.id).length
                        )[0].username
                      : "N/A"
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input 
                placeholder="Search users by name, username, or email..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {users?.length || 0} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.username}
                            </div>
                            <div className="text-xs text-neutral-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.isAdmin
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getUserBookings(user.id).length}</TableCell>
                      <TableCell>LKR {getUserTotalSpent(user.id).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUserDetails(user)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      No users found with the current search query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Viewing information for {selectedUser.username}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">
                      {selectedUser.firstName && selectedUser.lastName 
                        ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                        : selectedUser.username}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Badge
                        className={
                          selectedUser.isAdmin
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {selectedUser.isAdmin ? "Administrator" : "Regular User"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-neutral-500" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-neutral-500" />
                        <span>User ID: {selectedUser.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-neutral-500">Total Bookings</div>
                    <div className="text-2xl font-bold">{getUserBookings(selectedUser.id).length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-neutral-500">Total Spent</div>
                    <div className="text-2xl font-bold">LKR {getUserTotalSpent(selectedUser.id).toFixed(2)}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-neutral-500">Completed Bookings</div>
                    <div className="text-2xl font-bold">
                      {getUserBookings(selectedUser.id).filter(b => b.paymentStatus === 'completed').length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-neutral-500">Pending Bookings</div>
                    <div className="text-2xl font-bold">
                      {getUserBookings(selectedUser.id).filter(b => b.paymentStatus === 'pending').length}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Bookings */}
              {getUserBookings(selectedUser.id).length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Recent Bookings</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket Number</TableHead>
                        <TableHead>Journey Date</TableHead>
                        <TableHead>Passengers</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getUserBookings(selectedUser.id)
                        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                        .slice(0, 5)
                        .map(booking => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.ticketNumber}</TableCell>
                            <TableCell>{new Date(booking.journeyDate).toLocaleDateString()}</TableCell>
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
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" asChild>
                  <DialogClose>Close</DialogClose>
                </Button>
                {/* Additional actions could be added here */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}

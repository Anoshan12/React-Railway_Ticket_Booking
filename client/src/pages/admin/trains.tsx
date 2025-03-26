import { useState } from "react";
import AdminLayout from "@/components/admin/sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Train, Station, insertTrainSchema } from "@shared/schema";
import { Loader2, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminTrains() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const { toast } = useToast();
  
  // Form schema - extended from insertTrainSchema
  const trainFormSchema = insertTrainSchema.extend({
    departureStationId: z.number().min(1, "Departure station is required"),
    arrivalStationId: z.number().min(1, "Arrival station is required"),
    price: z.number().min(0, "Price must be positive"),
    availableSeats: z.number().min(0, "Available seats must be positive"),
  });
  
  // Fetch trains
  const { data: trains, isLoading: isLoadingTrains } = useQuery<Train[]>({
    queryKey: ['/api/trains'],
  });
  
  // Fetch stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Form handling
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<z.infer<typeof trainFormSchema>>({
    resolver: zodResolver(trainFormSchema),
    defaultValues: {
      name: "",
      departureStationId: 0,
      arrivalStationId: 0,
      departureTime: "",
      arrivalTime: "",
      price: 0,
      trainType: "",
      availableSeats: 100,
    }
  });
  
  // Create train mutation
  const createTrainMutation = useMutation({
    mutationFn: async (trainData: z.infer<typeof trainFormSchema>) => {
      const res = await apiRequest("POST", "/api/trains", trainData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      toast({
        title: "Train created",
        description: "The train schedule has been successfully created.",
      });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create train",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update train mutation
  const updateTrainMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Train> }) => {
      const res = await apiRequest("PUT", `/api/trains/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      toast({
        title: "Train updated",
        description: "The train schedule has been successfully updated.",
      });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update train",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete train mutation
  const deleteTrainMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/trains/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      toast({
        title: "Train deleted",
        description: "The train schedule has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete train",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof trainFormSchema>) => {
    if (selectedTrain) {
      updateTrainMutation.mutate({ id: selectedTrain.id, data });
    } else {
      createTrainMutation.mutate(data);
    }
  };
  
  // Open dialog for create/edit
  const openDialog = (train?: Train) => {
    if (train) {
      setSelectedTrain(train);
      setValue("name", train.name);
      setValue("departureStationId", train.departureStationId);
      setValue("arrivalStationId", train.arrivalStationId);
      setValue("departureTime", train.departureTime);
      setValue("arrivalTime", train.arrivalTime);
      setValue("price", train.price);
      setValue("trainType", train.trainType);
      setValue("availableSeats", train.availableSeats);
    } else {
      setSelectedTrain(null);
      reset();
    }
    setIsDialogOpen(true);
  };
  
  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTrain(null);
    reset();
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (train: Train) => {
    setSelectedTrain(train);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedTrain) {
      deleteTrainMutation.mutate(selectedTrain.id);
    }
  };
  
  // Get station name by ID
  const getStationName = (id: number) => {
    return stations?.find(station => station.id === id)?.name || "Unknown";
  };
  
  // Loading state
  if (isLoadingTrains || isLoadingStations) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading trains...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary mb-1">Train Management</h1>
            <p className="text-neutral-500">Manage train schedules and routes</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => openDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Train
          </Button>
        </div>
        
        {/* Train List */}
        <Card>
          <CardHeader>
            <CardTitle>Train Schedules</CardTitle>
            <CardDescription>List of all train routes and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">To</th>
                    <th className="px-4 py-3">Departure</th>
                    <th className="px-4 py-3">Arrival</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Seats</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trains && trains.length > 0 ? (
                    trains.map(train => (
                      <tr key={train.id} className="border-b hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium">{train.name}</td>
                        <td className="px-4 py-3">{train.trainType}</td>
                        <td className="px-4 py-3">{getStationName(train.departureStationId)}</td>
                        <td className="px-4 py-3">{getStationName(train.arrivalStationId)}</td>
                        <td className="px-4 py-3">{train.departureTime}</td>
                        <td className="px-4 py-3">{train.arrivalTime}</td>
                        <td className="px-4 py-3">LKR {train.price.toFixed(2)}</td>
                        <td className="px-4 py-3">{train.availableSeats}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDialog(train)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive"
                              onClick={() => openDeleteDialog(train)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-neutral-500">
                        No trains found. Create a new train schedule to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add/Edit Train Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTrain ? "Edit Train" : "Add New Train"}</DialogTitle>
            <DialogDescription>
              {selectedTrain 
                ? "Update the details of this train schedule" 
                : "Create a new train schedule for passengers"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Train Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Train Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input id="name" placeholder="e.g. Intercity Express" {...field} />
                )}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            {/* Train Type */}
            <div className="space-y-2">
              <Label htmlFor="trainType">Train Type</Label>
              <Controller
                name="trainType"
                control={control}
                render={({ field }) => (
                  <Input id="trainType" placeholder="e.g. Intercity Express" {...field} />
                )}
              />
              {errors.trainType && (
                <p className="text-sm text-destructive">{errors.trainType.message}</p>
              )}
            </div>
            
            {/* Stations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureStationId">Departure Station</Label>
                <Controller
                  name="departureStationId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations?.map((station) => (
                          <SelectItem key={station.id} value={station.id.toString()}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.departureStationId && (
                  <p className="text-sm text-destructive">{errors.departureStationId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrivalStationId">Arrival Station</Label>
                <Controller
                  name="arrivalStationId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations?.map((station) => (
                          <SelectItem key={station.id} value={station.id.toString()}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.arrivalStationId && (
                  <p className="text-sm text-destructive">{errors.arrivalStationId.message}</p>
                )}
              </div>
            </div>
            
            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <Input id="departureTime" placeholder="HH:MM" {...field} />
                  )}
                />
                {errors.departureTime && (
                  <p className="text-sm text-destructive">{errors.departureTime.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Controller
                  name="arrivalTime"
                  control={control}
                  render={({ field }) => (
                    <Input id="arrivalTime" placeholder="HH:MM" {...field} />
                  )}
                />
                {errors.arrivalTime && (
                  <p className="text-sm text-destructive">{errors.arrivalTime.message}</p>
                )}
              </div>
            </div>
            
            {/* Price and Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR)</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats</Label>
                <Controller
                  name="availableSeats"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="availableSeats" 
                      type="number" 
                      min="0" 
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))} 
                    />
                  )}
                />
                {errors.availableSeats && (
                  <p className="text-sm text-destructive">{errors.availableSeats.message}</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createTrainMutation.isPending || updateTrainMutation.isPending}
              >
                {(createTrainMutation.isPending || updateTrainMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedTrain ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  selectedTrain ? "Update Train" : "Create Train"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the train schedule "{selectedTrain?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteTrainMutation.isPending}
            >
              {deleteTrainMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

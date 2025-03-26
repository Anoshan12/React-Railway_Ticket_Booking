import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  
  // Handle login submission
  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };
  
  // Handle registration submission
  const onRegisterSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate({
      ...userData,
      isAdmin: false,
    });
  };
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-100 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Auth Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-heading font-bold text-secondary">Welcome to Sri Lanka Railways</CardTitle>
                    <CardDescription>Sign in to book your train tickets or create an account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      
                      {/* Login Form */}
                      <TabsContent value="login">
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="login-username">Username</Label>
                            <Input 
                              id="login-username" 
                              type="text" 
                              placeholder="Enter your username"
                              {...loginForm.register("username")} 
                            />
                            {loginForm.formState.errors.username && (
                              <p className="text-sm text-destructive">{loginForm.formState.errors.username.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input 
                              id="login-password" 
                              type="password" 
                              placeholder="Enter your password"
                              {...loginForm.register("password")} 
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                            )}
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                      
                      {/* Registration Form */}
                      <TabsContent value="register">
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-name">First Name</Label>
                              <Input 
                                id="first-name" 
                                type="text" 
                                placeholder="First name" 
                                {...registerForm.register("firstName")}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="last-name">Last Name</Label>
                              <Input 
                                id="last-name" 
                                type="text" 
                                placeholder="Last name" 
                                {...registerForm.register("lastName")}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                              id="username" 
                              type="text" 
                              placeholder="Choose a username" 
                              {...registerForm.register("username")}
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.username.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="Your email address" 
                              {...registerForm.register("email")}
                            />
                            {registerForm.formState.errors.email && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              placeholder="Create a password" 
                              {...registerForm.register("password")}
                            />
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input 
                              id="confirm-password" 
                              type="password" 
                              placeholder="Confirm your password" 
                              {...registerForm.register("confirmPassword")}
                            />
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                            )}
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right: Info/Hero */}
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
                  Experience Sri Lanka By Train
                </h1>
                <p className="text-neutral-600 mb-6">
                  Join thousands of travelers who book their train tickets online. Explore scenic routes, enjoy comfortable journeys, and discover the beauty of Sri Lanka's landscapes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">Easy Online Booking</h3>
                      <p className="text-sm text-neutral-600">Book tickets from anywhere, anytime without standing in queues.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">Digital Tickets</h3>
                      <p className="text-sm text-neutral-600">Get e-tickets sent directly to your email.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-800">Manage Bookings</h3>
                      <p className="text-sm text-neutral-600">View and manage all your train bookings in one place.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

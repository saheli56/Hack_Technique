import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { employersAPI } from "@/lib/api";
import { Building, ArrowLeft, Loader2 } from "lucide-react";

const EmployerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await employersAPI.login(formData);

      // Store employer data in localStorage
      localStorage.setItem('employer', JSON.stringify(response.employer));
      localStorage.setItem('employerToken', response.token);

      toast({
        title: "Login Successful!",
        description: "Welcome back to Shramik Mitra.",
      });

      navigate("/employer-dashboard");
    } catch (error) {
      console.error('Employer login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Employer Login
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Access your employer dashboard and manage your job postings
              </p>
            </div>
          </div>
        </section>

        {/* Login Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Employer Login
                  </CardTitle>
                  <CardDescription>
                    Sign in to your employer account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email Address
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Password
                      </label>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an employer account?{" "}
                      <Link to="/employer-signup" className="text-primary hover:underline">
                        Register here
                      </Link>
                    </p>
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                      <ArrowLeft className="w-4 h-4 inline mr-1" />
                      Back to Job Seeker Login
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerLogin;
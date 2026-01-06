import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { employersAPI } from "@/lib/api";
import { Building, ArrowLeft, Loader2 } from "lucide-react";

const EmployerSignup = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    companyType: "",
    location: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.contactPerson || !formData.phone || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await employersAPI.create(formData);

      toast({
        title: "Registration Successful!",
        description: "Your employer account has been created. Please login to continue.",
      });

      navigate("/employer-login");
    } catch (error) {
      console.error('Employer registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to create employer account. Please try again.",
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
                Join as Employer
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Post jobs and find the right talent for your business
              </p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Employer Registration
                  </CardTitle>
                  <CardDescription>
                    Create your employer account to start posting jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Company Name *
                        </label>
                        <Input
                          name="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Contact Person *
                        </label>
                        <Input
                          name="contactPerson"
                          placeholder="Enter contact person name"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Phone Number *
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Company Type
                        </label>
                        <select
                          name="companyType"
                          className="w-full h-10 px-4 rounded-lg border border-input bg-background"
                          value={formData.companyType}
                          onChange={handleChange}
                        >
                          <option value="">Select company type</option>
                          <option value="Construction">Construction</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Logistics">Logistics</option>
                          <option value="Retail">Retail</option>
                          <option value="Hospitality">Hospitality</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Location
                        </label>
                        <Input
                          name="location"
                          placeholder="Enter company location"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Company Description
                      </label>
                      <Textarea
                        name="description"
                        placeholder="Brief description about your company"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        variant="hero"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Employer Account'
                        )}
                      </Button>
                      <Link to="/employer-login">
                        <Button variant="outline" type="button">
                          Already have an account?
                        </Button>
                      </Link>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary">
                      <ArrowLeft className="w-4 h-4 inline mr-1" />
                      Back to Job Seeker Registration
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

export default EmployerSignup;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { jobsAPI } from "@/lib/api";
import { Building, ArrowLeft, Loader2, MapPin, DollarSign, Calendar } from "lucide-react";

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    deadline: "",
    jobType: "",
    experience: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['title', 'description', 'location', 'salary', 'deadline'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get employer data from localStorage
      const employerData = JSON.parse(localStorage.getItem('employer'));
      const token = localStorage.getItem('employerToken');

      if (!employerData || !token) {
        toast({
          title: "Authentication Error",
          description: "Please login as an employer first.",
          variant: "destructive",
        });
        navigate('/employer-login');
        return;
      }

      // Create job data with employer ID
      const jobData = {
        ...formData,
        employerId: employerData._id,
        salary: parseInt(formData.salary)
      };

      await jobsAPI.create(jobData);

      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and visible to job seekers.",
      });

      navigate("/employer-dashboard");
    } catch (error) {
      console.error('Job posting error:', error);
      toast({
        title: "Posting Failed",
        description: "Failed to post the job. Please try again.",
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
                Post a New Job
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Find the right talent for your business
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Job Posting Details
                  </CardTitle>
                  <CardDescription>
                    Fill in the details to create a job posting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Job Title *
                        </label>
                        <Input
                          name="title"
                          placeholder="e.g., Construction Worker, Electrician, Plumber"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Job Category
                          </label>
                          <select
                            name="category"
                            className="w-full h-10 px-4 rounded-lg border border-input bg-background"
                            value={formData.category}
                            onChange={handleChange}
                          >
                            <option value="">Select category</option>
                            <option value="Construction">Construction</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Painting">Painting</option>
                            <option value="Masonry">Masonry</option>
                            <option value="Welding">Welding</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Job Type
                          </label>
                          <select
                            name="jobType"
                            className="w-full h-10 px-4 rounded-lg border border-input bg-background"
                            value={formData.jobType}
                            onChange={handleChange}
                          >
                            <option value="">Select job type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Location and Salary */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Location & Compensation</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Location *
                          </label>
                          <Input
                            name="location"
                            placeholder="e.g., Mumbai, Delhi, Bangalore"
                            value={formData.location}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Salary (₹ per month) *
                          </label>
                          <Input
                            name="salary"
                            type="number"
                            placeholder="e.g., 15000"
                            value={formData.salary}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Experience and Deadline */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Requirements & Timeline</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Experience Level
                          </label>
                          <select
                            name="experience"
                            className="w-full h-10 px-4 rounded-lg border border-input bg-background"
                            value={formData.experience}
                            onChange={handleChange}
                          >
                            <option value="">Select experience</option>
                            <option value="Entry Level">Entry Level</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5+ years">5+ years</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Application Deadline *
                          </label>
                          <Input
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Job Description</h3>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Job Description *
                        </label>
                        <Textarea
                          name="description"
                          placeholder="Describe the job responsibilities, work environment, and what the candidate will be doing..."
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Requirements & Skills
                        </label>
                        <Textarea
                          name="requirements"
                          placeholder="List the required skills, qualifications, certifications, or experience needed..."
                          rows={3}
                          value={formData.requirements}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        variant="hero"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Posting Job...
                          </>
                        ) : (
                          'Post Job'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/employer-dashboard')}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </div>
                  </form>
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

export default JobPostingForm;
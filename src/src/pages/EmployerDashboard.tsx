import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { jobsAPI } from "@/lib/api";
import { Building, Plus, Edit, Trash2, Users, MapPin, Calendar, LogOut } from "lucide-react";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadEmployerJobs = useCallback(async () => {
    try {
      const employerData = JSON.parse(localStorage.getItem('employer'));
      const response = await jobsAPI.getByEmployer(employerData._id);
      setJobs(response);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load your jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const employerData = localStorage.getItem('employer');
    const token = localStorage.getItem('employerToken');

    if (!employerData || !token) {
      navigate('/employer-login');
      return;
    }

    setEmployer(JSON.parse(employerData));
    loadEmployerJobs();
  }, [navigate, loadEmployerJobs]);

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await jobsAPI.delete(jobId);
      toast({
        title: "Success",
        description: "Job posting deleted successfully.",
      });
      loadEmployerJobs(); // Reload jobs
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job posting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employer');
    localStorage.removeItem('employerToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Header Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  Employer Dashboard
                </h1>
                <p className="text-xl text-primary-foreground/80">
                  Welcome back, {employer?.companyName}
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/post-job">
                  <Button variant="secondary" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border-primary">
                    <Plus className="w-4 h-4" />
                    Post New Job
                  </Button>
                </Link>
                <Link to="/employer-applications">
                  <Button variant="outline" className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                    <Users className="w-4 h-4" />
                    View Applications
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Building className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{jobs.length}</p>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {jobs.filter(job => new Date(job.deadline) > new Date()).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Open Positions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Your Job Postings</h2>
              <Link to="/post-job">
                <Button variant="hero" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Post New Job
                </Button>
              </Link>
            </div>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Jobs Posted Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start posting jobs to find the right talent for your business.
                  </p>
                  <Link to="/post-job">
                    <Button variant="hero">Post Your First Job</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </CardDescription>
                        </div>
                        <Badge variant={new Date(job.deadline) > new Date() ? "default" : "secondary"}>
                          {new Date(job.deadline) > new Date() ? "Active" : "Expired"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Salary:</span>
                          <span className="font-medium">₹{job.salary}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Applications:</span>
                          <span className="font-medium">{job.applications?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="font-medium">
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Link to={`/edit-job/${job._id}`}>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
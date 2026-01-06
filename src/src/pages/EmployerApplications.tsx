import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { jobsAPI, applicationsAPI } from "@/lib/api";
import { Building, Users, MapPin, Calendar, ArrowLeft, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const EmployerApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  const loadJobApplications = async (jobId) => {
    try {
      const response = await applicationsAPI.getByJobId(jobId);
      setApplications(response);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJobSelect = (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    setSelectedJob(job);
    loadJobApplications(jobId);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdating(true);
      const employerData = JSON.parse(localStorage.getItem('employer'));

      await applicationsAPI.updateStatus(applicationId, {
        status: newStatus,
        employerId: employerData._id
      });

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
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
                  Job Applications
                </h1>
                <p className="text-xl text-primary-foreground/80">
                  Review and manage applications for your posted jobs
                </p>
              </div>
              <Link to="/employer-dashboard">
                <Button variant="outline" className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Jobs List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Your Jobs
                    </CardTitle>
                    <CardDescription>
                      Select a job to view applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No jobs posted yet.{" "}
                        <Link to="/post-job" className="text-primary hover:underline">
                          Post your first job
                        </Link>
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {jobs.map((job) => (
                          <div
                            key={job._id}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedJob?._id === job._id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleJobSelect(job._id)}
                          >
                            <h3 className="font-semibold text-sm">{job.title}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {job.applications?.length || 0} applications
                              </span>
                              <Badge variant={new Date(job.deadline) > new Date() ? "default" : "secondary"} className="text-xs">
                                {new Date(job.deadline) > new Date() ? "Active" : "Expired"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Applications List */}
              <div className="lg:col-span-2">
                {selectedJob ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Applications for: {selectedJob.title}
                      </CardTitle>
                      <CardDescription>
                        {applications.length} application{applications.length !== 1 ? 's' : ''} received
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {applications.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                          <p className="text-muted-foreground">
                            Applications will appear here once job seekers apply to this position.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {applications.map((application) => (
                            <Card key={application._id} className="border-l-4 border-l-primary/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="font-semibold text-lg">{application.userId.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {application.userId.location}
                                      </span>
                                      <span>{application.userId.phone}</span>
                                      <span>{application.userId.email}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(application.status)}
                                    {getStatusBadge(application.status)}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {application.userId.skills?.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      )) || <span className="text-sm text-muted-foreground">No skills listed</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Applied On</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                {application.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                      disabled={updating}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                      disabled={updating}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a Job</h3>
                      <p className="text-muted-foreground">
                        Choose a job from the list to view its applications.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerApplications;
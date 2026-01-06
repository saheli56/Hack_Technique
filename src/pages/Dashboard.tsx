import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { applicationsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, MapPin, IndianRupee, Clock, Building, User, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const loadUserApplications = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        const data = await applicationsAPI.getByUserId(user._id);
        console.log('Applications data:', data);
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast({
        title: t("auth.error"),
        description: "Failed to load your applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadUserApplications();
    } else {
      toast({
        title: t("auth.loginRequired"),
        description: "Please login to view your dashboard.",
        variant: "destructive",
      });
    }
  }, [loadUserApplications, toast]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Accepted',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Rejected',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Pending Review',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{t("auth.loginRequired")}</h1>
              <p className="text-muted-foreground mb-6">Please login to view your dashboard.</p>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>
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
        {/* Hero Section */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Track your job applications and manage your profile
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{applications.length}</p>
                        <p className="text-sm text-muted-foreground">Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {applications.filter(app => app.status === 'accepted').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Accepted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {applications.filter(app => app.status === 'rejected').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>Your personal information and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {user.name}</p>
                        <p><span className="font-medium">Email:</span> {user.email || 'Not provided'}</p>
                        <p><span className="font-medium">Phone:</span> {user.phone}</p>
                        <p><span className="font-medium">Location:</span> {user.location}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Your Job Applications
                  </CardTitle>
                  <CardDescription>Track the status of your job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading applications...</span>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application._id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                              {/* Job Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                      {application.jobId?.title}
                                    </h3>
                                    <p className="text-sm text-primary mb-2">{application.jobId?.titleHi}</p>
                                    <p className="text-muted-foreground text-sm mb-3">{application.jobId?.company}</p>
                                  </div>
                                  <Badge className={`flex items-center gap-1 ${getStatusDisplay(application.status).className}`}>
                                    {getStatusDisplay(application.status).icon}
                                    {getStatusDisplay(application.status).text}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {application.jobId?.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <IndianRupee className="w-4 h-4" />
                                    {application.jobId?.salary}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {application.jobId?.type}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start applying to jobs to see your applications here.
                      </p>
                      <Link to="/jobs">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  )}
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

export default Dashboard;
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Search, Briefcase, Clock, IndianRupee, Building, Filter,
  Star, Users, CheckCircle, Loader2
} from "lucide-react";
import { jobsAPI, applicationsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const locations = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", 
  "Kolkata", "Ahmedabad", "Surat", "Jaipur"
];

const categories = [
  "Construction", "Manufacturing", "Domestic Help", "Driving", 
  "Security", "Delivery", "Farming", "Hospitality"
];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadJobs();
    // Get search term from URL query parameter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedLocation, selectedCategory]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({
        title: t("auth.error"),
        description: t("auth.submitError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.type.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    setFilteredJobs(filtered);
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        toast({
          title: t("auth.loginRequired"),
          description: t("auth.loginRequiredDesc"),
          variant: "destructive",
        });
        return;
      }

      await applicationsAPI.create({
        jobId,
        userId: user._id,
      });

      toast({
        title: t("auth.applicationSubmitted"),
        description: t("auth.applicationSubmittedDesc"),
      });

      setJobs(jobs.map(job =>
        job._id === jobId
          ? { ...job, applicants: job.applicants + 1 }
          : job
      ));
    } catch (error) {
      console.error('Failed to apply for job:', error);
      toast({
        title: t("auth.error"),
        description: t("auth.submitError"),
        variant: "destructive",
      });
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {t("jobs.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              {t("jobs.subtitle")}
            </p>

            {/* Search Bar */}
            <div className="bg-card rounded-xl p-4 shadow-medium max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={t("jobs.searchPlaceholder")}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select 
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">{t("jobs.allLocations")}</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <Button variant="hero" className="w-full">
                  <Search className="w-5 h-5" />
                  {t("jobs.searchJobs")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 shrink-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      {t("jobs.filters")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium mb-3">{t("jobs.category")}</h4>
                      <div className="space-y-2">
                        {categories.map(cat => (
                          <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-input"
                              checked={selectedCategory === cat}
                              onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                            />
                            {cat}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Job Type */}
                    <div>
                      <h4 className="font-medium mb-3">{t("jobs.jobType")}</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          {t("jobs.fullTime")}
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          {t("jobs.partTime")}
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          {t("jobs.contract")}
                        </label>
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <h4 className="font-medium mb-3">{t("jobs.salaryRange")}</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          ₹10,000 - ₹15,000
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          ₹15,000 - ₹20,000
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          ₹20,000+
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Job Listings */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {t("jobs.showingJobs")} <strong className="text-foreground">{filteredJobs.length}</strong> {t("jobs.jobs")}
                  </p>
                  <select className="h-10 px-4 rounded-lg border border-input bg-background text-foreground">
                    <option>{t("jobs.mostRecent")}</option>
                    <option>{t("jobs.highestSalary")}</option>
                    <option>{t("jobs.mostApplicants")}</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">{t("jobs.loadingJobs")}</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <Card key={job._id} variant="interactive">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            {/* Company Logo Placeholder */}
                            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <Building className="w-8 h-8 text-muted-foreground" />
                            </div>

                            {/* Job Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    {job.title}
                                    {job.verified && (
                                      <CheckCircle className="w-5 h-5 text-success" />
                                    )}
                                  </h3>
                                  <p className="text-sm text-primary">{job.titleHi}</p>
                                  <p className="text-muted-foreground mt-1">{job.company}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApply(job._id)}
                                  disabled={applying === job._id}
                                >
                                  {applying === job._id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      {t("jobs.applying")}
                                    </>
                                  ) : (
                                    t("jobs.applyNow")
                                  )}
                                </Button>
                              </div>

                              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  {job.salary}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {job.applicants} {t("jobs.applicants")}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 mt-4">
                                <span className="text-xs text-muted-foreground">
                                  {t("jobs.posted")} {job.posted}
                                </span>
                                {job.verified && (
                                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                                    {t("jobs.verifiedEmployer")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {!loading && filteredJobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{t("jobs.noJobsFound")}</p>
                  </div>
                )}

                {/* Load More */}
                {!loading && filteredJobs.length > 0 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                      {t("jobs.loadMoreJobs")}
                    </Button>
                  </div>
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

export default Jobs;

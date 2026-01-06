import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Users, Scale, Wallet, Clock, MapPin, TrendingUp, MessageSquare } from "lucide-react";

const recentJobs = [
  {
    id: 1,
    title: "Construction Worker",
    company: "BuildCorp Ltd",
    location: "Mumbai, Maharashtra",
    salary: "₹450/day",
    posted: "2 hours ago",
    urgent: true
  },
  {
    id: 2,
    title: "Factory Helper",
    company: "Tech Manufacturing",
    location: "Delhi, NCR",
    salary: "₹380/day",
    posted: "4 hours ago",
    urgent: false
  },
  {
    id: 3,
    title: "Domestic Helper",
    company: "Home Services Co",
    location: "Bangalore, Karnataka",
    salary: "₹500/day",
    posted: "6 hours ago",
    urgent: false
  }
];

const recentDiscussions = [
  {
    id: 1,
    title: "Salary payment delays in construction sector",
    author: "Rajesh K.",
    replies: 23,
    lastActivity: "1 hour ago",
    category: "Legal Help"
  },
  {
    id: 2,
    title: "Best areas for migrant workers in Mumbai",
    author: "Priya S.",
    replies: 45,
    lastActivity: "3 hours ago",
    category: "Housing"
  },
  {
    id: 3,
    title: "Loan options for skill development courses",
    author: "Amit S.",
    replies: 18,
    lastActivity: "5 hours ago",
    category: "Education"
  }
];

const recentUpdates = [
  {
    id: 1,
    type: "legal",
    title: "New minimum wage guidelines released",
    description: "Central government updates minimum wage for 2026",
    time: "1 day ago",
    icon: Scale
  },
  {
    id: 2,
    type: "job",
    title: "500 new construction jobs added",
    description: "Major infrastructure projects hiring across states",
    time: "2 days ago",
    icon: Briefcase
  },
  {
    id: 3,
    type: "loan",
    title: "Emergency loan scheme extended",
    description: "Additional ₹100 crore allocated for worker loans",
    time: "3 days ago",
    icon: Wallet
  }
];

export function RecentActivitySection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest Activity
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest opportunities and discussions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Latest Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {job.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {job.company}
                          </p>
                        </div>
                        {job.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                        <span className="text-xs text-success font-medium">
                          {job.salary}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {job.posted}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Community Discussions */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-success" />
                Community Buzz
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                {recentDiscussions.map((discussion) => (
                  <div key={discussion.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground line-clamp-2">
                        {discussion.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          by {discussion.author}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {discussion.replies} replies
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {discussion.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/community">Join Discussion</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-info" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                {recentUpdates.map((update) => {
                  const Icon = update.icon;
                  return (
                    <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        update.type === 'legal' ? 'bg-warning/10' :
                        update.type === 'job' ? 'bg-primary/10' :
                        'bg-success/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          update.type === 'legal' ? 'text-warning' :
                          update.type === 'job' ? 'text-primary' :
                          'text-success'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground">
                          {update.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Updates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Stats Bar */}
        <div className="mt-12 bg-card rounded-xl p-6 border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">247</div>
              <div className="text-sm text-muted-foreground">Jobs Added Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success mb-1">1,429</div>
              <div className="text-sm text-muted-foreground">Active Discussions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning mb-1">₹2.3M</div>
              <div className="text-sm text-muted-foreground">Loans Disbursed Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info mb-1">98.5%</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
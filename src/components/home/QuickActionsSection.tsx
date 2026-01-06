import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Phone, MessageSquare, Zap, Users, Briefcase } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function QuickActionsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobSearchTerm, setJobSearchTerm] = useState("");

  const handleJobSearch = () => {
    if (jobSearchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(jobSearchTerm)}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleJobSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJobSearch();
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-success/5 to-info/5 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t("quickActions.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("quickActions.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Quick Job Search */}
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("quickActions.jobs.title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("quickActions.jobs.subtitle")}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder={t("quickActions.jobs.placeholder")} 
                  className="h-8 text-sm" 
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                  onKeyPress={handleJobSearchKeyPress}
                />
                <Button size="sm" className="w-full" onClick={handleJobSearch}>
                  {t("quickActions.jobs.button")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Help */}
          <Card className="hover:shadow-lg transition-all duration-300 border-warning/20 hover:border-warning/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("quickActions.emergency.title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("quickActions.emergency.subtitle")}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full border-warning/20 text-warning hover:bg-warning/10" asChild>
                  <Link to="/legal">
                    <Phone className="w-4 h-4 mr-2" />
                    {t("quickActions.emergency.legalHelp")}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full border-warning/20 text-warning hover:bg-warning/10">
                  <Phone className="w-4 h-4 mr-2" />
                  {t("quickActions.emergency.police")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Loan Check */}
          <Card className="hover:shadow-lg transition-all duration-300 border-success/20 hover:border-success/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("quickActions.loans.title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("quickActions.loans.subtitle")}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-success hover:bg-success/90" asChild>
                  <Link to="/loans">{t("quickActions.loans.checkEligibility")}</Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full border-success/20 text-success hover:bg-success/10">
                  {t("quickActions.loans.emiCalculator")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Connect */}
          <Card className="hover:shadow-lg transition-all duration-300 border-info/20 hover:border-info/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("quickActions.community.title")}</h3>
                  <p className="text-xs text-muted-foreground">{t("quickActions.community.subtitle")}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-info hover:bg-info/90" asChild>
                  <Link to="/community">{t("quickActions.community.joinDiscussion")}</Link>
                </Button>
                <Button size="sm" variant="outline" className="w-full border-info/20 text-info hover:bg-info/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("quickActions.community.askQuestion")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location & Language Quick Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{t("quickActions.location")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              {t("quickActions.languages.english")}
            </Button>
            <span className="text-muted-foreground">|</span>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              {t("quickActions.languages.hindi")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
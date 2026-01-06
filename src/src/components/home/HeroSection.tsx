import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, Users, Shield, Phone, Zap, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Simple clean background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Main Message - Clear and Direct */}
          <div className="space-y-6">
            {/* Clear Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t("hero.title")}
              <span className="text-primary block mt-2">{t("hero.titleHighlight")}</span>
            </h1>
            
            {/* Simple Value Prop */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Primary Actions - Big and Clear */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/jobs" className="flex-1 sm:flex-initial">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-lg hover:shadow-xl transition-all">
                  <Briefcase className="w-5 h-5" />
                  {t("hero.findJobs")}
                </Button>
              </Link>
              <Link to="/ivr" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold px-8 border-2 hover:bg-accent">
                  <Phone className="w-5 h-5" />
                  {t("hero.callHelpline")}
                </Button>
              </Link>
            </div>

            {/* Quick Stats - Build Trust */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">{t("hero.stats.jobsPosted")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">{t("hero.stats.legalHelp")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">{t("hero.stats.ivrSupport")}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Access Cards - Minimal & Actionable */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/jobs" className="group">
              <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50 bg-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t("hero.cards.jobs.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("hero.cards.jobs.description")}</p>
              </Card>
            </Link>

            <Link to="/community" className="group">
              <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50 bg-card">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t("hero.cards.community.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("hero.cards.community.description")}</p>
              </Card>
            </Link>

            <Link to="/legal" className="group">
              <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50 bg-card">
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-info" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t("hero.cards.legalHelp.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("hero.cards.legalHelp.description")}</p>
              </Card>
            </Link>

            <Link to="/loans" className="group">
              <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50 bg-card">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t("hero.cards.quickLoans.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("hero.cards.quickLoans.description")}</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

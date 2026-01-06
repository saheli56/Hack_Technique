import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Scale, Wallet, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const features = [
  {
    icon: Briefcase,
    titleKey: "features.jobSearch.title",
    titleHiKey: "features.jobSearch.titleHi",
    descriptionKey: "features.jobSearch.description",
    path: "/jobs",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    titleKey: "features.communityForum.title",
    titleHiKey: "features.communityForum.titleHi",
    descriptionKey: "features.communityForum.description",
    path: "/community",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Scale,
    titleKey: "features.legalSupport.title",
    titleHiKey: "features.legalSupport.titleHi",
    descriptionKey: "features.legalSupport.description",
    path: "/legal",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: Wallet,
    titleKey: "features.microLoans.title",
    titleHiKey: "features.microLoans.titleHi",
    descriptionKey: "features.microLoans.description",
    path: "/loans",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Phone,
    titleKey: "features.ivrHelpline.title",
    titleHiKey: "features.ivrHelpline.titleHi",
    descriptionKey: "features.ivrHelpline.description",
    path: "/ivr",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: MapPin,
    titleKey: "features.locationServices.title",
    titleHiKey: "features.locationServices.titleHi",
    descriptionKey: "features.locationServices.description",
    path: "/jobs",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("features.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.path}>
                <Card 
                  variant="interactive" 
                  className="h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="flex flex-col gap-1">
                      <span>{t(feature.titleKey)}</span>
                      <span className="text-sm font-normal text-muted-foreground">{t(feature.titleHiKey)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(feature.descriptionKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

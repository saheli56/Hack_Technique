import { UserPlus, Search, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    titleKey: "howItWorks.register.title",
    titleHiKey: "howItWorks.register.titleHi",
    descriptionKey: "howItWorks.register.description",
  },
  {
    icon: Search,
    step: "02",
    titleKey: "howItWorks.search.title",
    titleHiKey: "howItWorks.search.titleHi",
    descriptionKey: "howItWorks.search.description",
  },
  {
    icon: Send,
    step: "03",
    titleKey: "howItWorks.apply.title",
    titleHiKey: "howItWorks.apply.titleHi",
    descriptionKey: "howItWorks.apply.description",
  },
  {
    icon: CheckCircle,
    step: "04",
    titleKey: "howItWorks.getHired.title",
    titleHiKey: "howItWorks.getHired.titleHi",
    descriptionKey: "howItWorks.getHired.description",
  },
];

export function HowItWorksSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center">
                  <div className="relative z-10 w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{t(step.titleKey)}</h3>
                  <p className="text-sm text-primary mb-2">{t(step.titleHiKey)}</p>
                  <p className="text-muted-foreground">{t(step.descriptionKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

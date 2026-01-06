import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-primary mb-2">
            {t("cta.subtitle")}
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button variant="hero" size="xl">
                {t("cta.getStarted")}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/ivr">
              <Button variant="outline" size="xl">
                <Phone className="w-5 h-5" />
                {t("cta.callIvr")}
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-card rounded-xl border inline-block">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{t("cta.notTechSavvy")}</strong> {t("cta.ivrDescription")}
            </p>
            <p className="text-2xl font-bold text-primary mt-2">{t("cta.helplineNumber")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

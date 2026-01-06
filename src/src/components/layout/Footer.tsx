import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">श्र</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">ShramikMitra</span>
                <span className="text-xs text-background/60 leading-tight">श्रमिक साथी</span>
              </div>
            </div>
            <p className="text-background/70 text-sm">
              {t("footer.empoweringWorkers")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/jobs" className="hover:text-primary transition-colors">{t("footer.findJobs")}</Link></li>
              <li><Link to="/community" className="hover:text-primary transition-colors">{t("footer.communityForum")}</Link></li>
              <li><Link to="/legal" className="hover:text-primary transition-colors">{t("footer.legalSupport")}</Link></li>
              <li><Link to="/loans" className="hover:text-primary transition-colors">{t("footer.microLoans")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/ivr" className="hover:text-primary transition-colors">{t("footer.ivrHelpline")}</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t("footer.faqs")}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t("footer.safetyTips")}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t("footer.reportIssue")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-3 text-background/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{t("footer.tollFree")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{t("footer.email")}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{t("footer.panIndia")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60 text-sm">
          <p className="flex items-center justify-center gap-1">
            {t("footer.madeWithLove")} <Heart className="w-4 h-4 text-primary fill-primary" /> {t("footer.forWorkforce")}
          </p>
          <p className="mt-2">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

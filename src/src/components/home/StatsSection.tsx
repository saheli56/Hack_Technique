import { Users, Briefcase, Building, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const stats = [
  { icon: Users, value: "50,000+", labelKey: "stats.workersRegistered", labelHiKey: "stats.workersRegisteredHi" },
  { icon: Briefcase, value: "10,000+", labelKey: "stats.jobsListed", labelHiKey: "stats.jobsListedHi" },
  { icon: Building, value: "2,500+", labelKey: "stats.verifiedEmployers", labelHiKey: "stats.verifiedEmployersHi" },
  { icon: MapPin, value: "100+", labelKey: "stats.citiesCovered", labelHiKey: "stats.citiesCoveredHi" },
];

export function StatsSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 gradient-hero relative overflow-hidden">
      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/15" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg">
                  <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-xl">
                  {stat.value}
                </div>
                <div className="text-white/95 drop-shadow-lg">
                  <div className="font-medium">{t(stat.labelKey)}</div>
                  <div className="text-sm opacity-90">{t(stat.labelHiKey)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

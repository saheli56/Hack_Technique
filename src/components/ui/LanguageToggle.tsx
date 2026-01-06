import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="w-4 h-4" />
      {language === 'en' ? 'हिंदी' : 'English'}
    </Button>
  );
};
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, Users, Scale, Wallet, Phone, Home, LogOut, User, LogIn, UserPlus, Building } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";

const navItems = [
  { nameKey: "nav.home", path: "/", icon: Home },
  { nameKey: "nav.jobs", path: "/jobs", icon: Briefcase },
  { nameKey: "nav.community", path: "/community", icon: Users },
  { nameKey: "nav.legalHelp", path: "/legal", icon: Scale },
  { nameKey: "nav.loans", path: "/loans", icon: Wallet },
  { nameKey: "nav.ivrHelp", path: "/ivr", icon: Phone },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [employer, setEmployer] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmployer = localStorage.getItem("employer");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedEmployer) {
      setEmployer(JSON.parse(storedEmployer));
    }
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleEmployerLogout = () => {
    localStorage.removeItem("employer");
    localStorage.removeItem("employerToken");
    setEmployer(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">श्र</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">ShramikMitra</span>
              <span className="text-xs text-muted-foreground leading-tight">श्रमिक साथी</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {t(item.nameKey)}
                  </Button>
                </Link>
              );
            })}

            {/* Authentication Buttons */}
            <div className="ml-4 flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleUserLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : employer ? (
                <div className="flex items-center gap-2">
                  <Link to="/employer-dashboard">
                    <Button variant="ghost" size="sm">
                      {t('nav.employerDashboard')}
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{employer.companyName}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleEmployerLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="default" size="sm">
                        {t('nav.signup')}
                      </Button>
                    </Link>
                  </div>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <div className="flex items-center gap-1">
                    <Link to="/employer-login">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Building className="w-3 h-3 mr-1" />
                        {t('nav.employerLogin')}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="w-5 h-5" />
                    {t(item.nameKey)}
                  </Button>
                </Link>
              );
            })}

            {/* Mobile Authentication */}
            <div className="border-t border-border pt-4 mt-2">
              {user ? (
                <div className="space-y-2">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <User className="w-5 h-5" />
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleUserLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : employer ? (
                <div className="space-y-2">
                  <Link to="/employer-dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Building className="w-5 h-5" />
                      {t('nav.employerDashboard')}
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10">
                    <Building className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">{employer.companyName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleEmployerLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground px-3">{t('nav.forJobSeekers')}</p>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <LogIn className="w-5 h-5" />
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full justify-start gap-3">
                        <UserPlus className="w-5 h-5" />
                        {t('nav.signup')}
                      </Button>
                    </Link>
                  </div>
                  <div className="border-t border-border pt-2 mt-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground px-3">{t('nav.forEmployers')}</p>
                    <Link to="/employer-login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Building className="w-5 h-5" />
                        {t('nav.employerLogin')}
                      </Button>
                    </Link>
                    <Link to="/employer-signup" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Building className="w-5 h-5" />
                        {t('nav.employerSignup')}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

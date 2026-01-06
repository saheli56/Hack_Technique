import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2, LogIn, ArrowRight } from "lucide-react";

const Login = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await usersAPI.login(credentials);

      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: t("auth.loginSuccessful"),
        description: t("auth.welcomeUser").replace("{name}", response.user.name),
      });

      navigate("/");
    } catch (error) {
      setError(error.message || t("auth.submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {t("auth.welcomeBack")}
              </h1>
              <p className="text-xl text-primary-foreground/80">
                {t("auth.loginToAccount")}
              </p>
            </div>
          </div>
        </section>

        {/* Login Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    {t("auth.loginToYourAccount")}
                  </CardTitle>
                  <CardDescription>
                    {t("auth.enterCredentials")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("auth.email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t("auth.enterEmail")}
                        value={credentials.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      {t("auth.or")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("auth.phoneNumber")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("auth.enterPhoneNumber")}
                        value={credentials.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("auth.loggingIn")}
                        </>
                      ) : (
                        <>
                          {t("auth.login")}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("auth.noAccount")}{" "}
                      <Link to="/signup" className="text-primary hover:underline font-medium">
                        {t("auth.signUpHere")}
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
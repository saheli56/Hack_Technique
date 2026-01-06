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
import { Loader2, UserPlus, ArrowRight } from "lucide-react";

const Signup = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const skillsArray = formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill);
      const userData = {
        ...formData,
        skills: skillsArray
      };

      await usersAPI.create(userData);

      toast({
        title: t("auth.accountCreated"),
        description: t("auth.accountCreatedDesc"),
      });

      navigate("/login");
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
                {t("auth.createAccount")}
              </h1>
              <p className="text-xl text-primary-foreground/80">
                {t("auth.joinCommunity")}
              </p>
            </div>
          </div>
        </section>

        {/* Signup Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    {t("auth.createAccount")}
                  </CardTitle>
                  <CardDescription>
                    {t("auth.joinCommunity")}
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
                      <Label htmlFor="name">{t("auth.fullName")} *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t("auth.enterFullName")}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("auth.email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t("auth.enterEmail")}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("auth.phoneNumber")} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("auth.enterPhoneNumber")}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">{t("auth.skills")}</Label>
                      <Input
                        id="skills"
                        name="skills"
                        type="text"
                        placeholder={t("auth.enterSkills")}
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t("auth.location")} *</Label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        placeholder={t("auth.enterLocation")}
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("auth.creatingAccount")}
                        </>
                      ) : (
                        <>
                          {t("auth.createAccountBtn")}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("auth.noAccount")}{" "}
                      <Link to="/login" className="text-primary hover:underline font-medium">
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

export default Signup;
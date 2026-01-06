import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, Headphones, Mic, Globe, Clock, CheckCircle,
  Volume2, Languages, UserCheck, HelpCircle
} from "lucide-react";

const ivrFeatures = [
  {
    icon: Globe,
    title: "Multiple Languages",
    titleHi: "कई भाषाएं",
    description: "Available in Hindi, English, Tamil, Telugu, Bengali, Marathi, and more regional languages",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    titleHi: "24/7 उपलब्ध",
    description: "Call anytime, day or night. Our IVR system is always ready to help you",
  },
  {
    icon: UserCheck,
    title: "No App Required",
    titleHi: "कोई ऐप नहीं चाहिए",
    description: "Works on any phone - basic, feature, or smartphone. Just dial and use",
  },
  {
    icon: Volume2,
    title: "Voice Guidance",
    titleHi: "वॉयस गाइडेंस",
    description: "Simple voice instructions guide you through each step. Easy for everyone",
  },
];

const ivrMenu = [
  { key: "1", title: "Job Search", titleHi: "नौकरी खोजें", description: "Find jobs based on location and skills" },
  { key: "2", title: "Apply for Job", titleHi: "नौकरी के लिए आवेदन करें", description: "Apply to jobs over phone" },
  { key: "3", title: "Legal Help", titleHi: "कानूनी मदद", description: "Get legal assistance and information" },
  { key: "4", title: "Loan Information", titleHi: "लोन जानकारी", description: "Check loan eligibility and apply" },
  { key: "5", title: "Community Support", titleHi: "समुदाय सहायता", description: "Connect with local support groups" },
  { key: "0", title: "Speak to Agent", titleHi: "एजेंट से बात करें", description: "Talk to a human support agent" },
];

const IVR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Phone className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              IVR Helpline
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-2">
              आईवीआर हेल्पलाइन - Your Voice Assistant
            </p>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              Not comfortable with apps? Just call our toll-free number and access all services through simple voice commands.
            </p>
            
            {/* Phone Number */}
            <div className="inline-block bg-primary-foreground text-primary px-8 py-6 rounded-2xl shadow-glow">
              <p className="text-sm mb-2">Toll-Free Number (24/7)</p>
              <p className="text-4xl md:text-5xl font-bold">1800-XXX-XXXX</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              Why Use IVR Helpline?
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              IVR हेल्पलाइन क्यों इस्तेमाल करें?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ivrFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} variant="interactive" className="text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-primary mb-3">{feature.titleHi}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* IVR Menu */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              IVR Menu Options
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              फोन पर यह विकल्प दबाएं
            </p>

            <div className="max-w-3xl mx-auto">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {ivrMenu.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                          <span className="text-xl font-bold text-primary-foreground">{item.key}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <span className="text-sm text-primary">| {item.titleHi}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              How to Use IVR / IVR कैसे इस्तेमाल करें
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Phone className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">1</div>
                  <h3 className="font-semibold text-lg mb-2">Dial the Number</h3>
                  <p className="text-sm text-muted-foreground">
                    Call 1800-XXX-XXXX from any phone
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Languages className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Select Language</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Headphones className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Follow Instructions</h3>
                  <p className="text-sm text-muted-foreground">
                    Press keys as guided by voice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Help Right Now?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              अभी मदद चाहिए? हमें कॉल करें!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                <Phone className="w-5 h-5" />
                Call 1800-XXX-XXXX
              </Button>
              <Button variant="outline" size="xl">
                <HelpCircle className="w-5 h-5" />
                View FAQ
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IVR;

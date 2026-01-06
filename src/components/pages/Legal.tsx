import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Scale, FileText, MessageSquare, Phone, Shield,
  BookOpen, HelpCircle, ChevronRight, Search, ExternalLink,
  AlertTriangle, CheckCircle, Clock, Download, Users,
  MapPin, Calendar, Star, Filter, Lightbulb
} from "lucide-react";

const legalCategories = [
  {
    icon: FileText,
    title: "Employment Rights",
    titleHi: "रोजगार अधिकार",
    description: "Minimum wage, working hours, leave policies",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Safety & Health",
    titleHi: "सुरक्षा और स्वास्थ्य",
    description: "Workplace safety, insurance, medical benefits",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    titleHi: "विवाद समाधान",
    description: "Filing complaints, labor courts, mediation",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    titleHi: "दस्तावेज़ीकरण",
    description: "ID cards, contracts, registration",
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

const faqs = [
  {
    question: "What is the minimum wage for workers?",
    questionHi: "श्रमिकों के लिए न्यूनतम मजदूरी क्या है?",
    answer: "Minimum wages vary by state and type of work. As of 2025, the central government has set the floor wage at ₹178 per day. Check your state's specific rates.",
  },
  {
    question: "How many hours can I be asked to work?",
    questionHi: "मुझे कितने घंटे काम करने के लिए कहा जा सकता है?",
    answer: "According to labor laws, maximum working hours are 48 hours per week or 9 hours per day. Overtime must be paid at double the normal rate.",
  },
  {
    question: "What if my employer doesn't pay my salary?",
    questionHi: "अगर मेरा नियोक्ता मेरी सैलरी नहीं देता है तो?",
    answer: "You can file a complaint with the labor commissioner of your area. You can also approach the labor court. Keep all proof of employment.",
  },
  {
    question: "Am I entitled to weekly holidays?",
    questionHi: "क्या मुझे साप्ताहिक छुट्टी का अधिकार है?",
    answer: "Yes, every worker is entitled to at least one day off per week. Most establishments provide Sunday as a weekly holiday.",
  },
  {
    question: "How to register a complaint against employer?",
    questionHi: "नियोक्ता के खिलाफ शिकायत कैसे दर्ज करें?",
    answer: "Visit your local labor commissioner office with your ID, employment proof, and complaint details. You can also file online through Shram Suvidha Portal.",
  },
];

const resources = [
  { name: "Shram Suvidha Portal", url: "https://shramsuvidha.gov.in/", description: "Government labor portal" },
  { name: "E-Shram Card", url: "https://eshram.gov.in/", description: "Register for benefits" },
  { name: "Labour Law Handbook", url: "https://labour.gov.in/", description: "Ministry of Labour" },
  { name: "State Labor Offices", url: "https://labour.gov.in/en/state-government-labour-departments", description: "Contact directory" },
];

const Legal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");

  // Filter FAQs based on search term and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle question submission
    console.log("Question submitted:", { question, email });
    // Reset form
    setQuestion("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Legal Support & Resources
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-4">
              कानूनी सहायता और संसाधन - Know Your Rights
            </p>
            <p className="text-primary-foreground/70 max-w-2xl">
              Access legal information, understand your rights as a worker, and get help with legal issues.
            </p>
          </div>
        </section>

        {/* Legal Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Legal Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {legalCategories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Card key={index} variant="interactive">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-2xl ${cat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-8 h-8 ${cat.color}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
                      <p className="text-sm text-primary mb-2">{cat.titleHi}</p>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* FAQs */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search FAQs... / FAQ खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions ({filteredFAQs.length})
                </h2>

                {filteredFAQs.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No FAQs found matching your search. Try different keywords.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div>
                            <h3 className="font-semibold text-foreground text-left">
                              {faq.question}
                            </h3>
                            <p className="text-sm text-primary mt-1 text-left">
                              {faq.questionHi}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:w-80 shrink-0 space-y-6">
                {/* Ask a Question */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      Ask a Question
                    </CardTitle>
                    <CardDescription>सवाल पूछें</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQuestionSubmit} className="space-y-4">
                      <Input
                        placeholder="Your email / आपका ईमेल"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Textarea
                        placeholder="Your question / आपका सवाल"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={4}
                        required
                      />
                      <Button type="submit" variant="hero" className="w-full">
                        Submit Question
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Helpline */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <Phone className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Legal Helpline</h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">
                      24/7 toll-free support
                    </p>
                    <p className="text-2xl font-bold">1800-XXX-XXXX</p>
                  </CardContent>
                </Card>

                {/* Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Useful Resources</CardTitle>
                    <CardDescription>उपयोगी संसाधन</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* Document Templates Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Legal Document Templates</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download ready-to-use legal document templates for common situations faced by workers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Salary Slip Template", icon: FileText, description: "Monthly salary record format" },
                { name: "Complaint Letter", icon: MessageSquare, description: "Formal complaint to employer" },
                { name: "Employment Contract", icon: Scale, description: "Work agreement template" },
                { name: "Resignation Letter", icon: ExternalLink, description: "Professional resignation format" }
              ].map((template, index) => {
                const Icon = template.icon;
                return (
                  <Card key={index} variant="interactive" className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Legal Aid Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Emergency Legal Aid</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Quick access to legal aid centers and emergency contacts in your area.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Legal Aid Centers
                  </CardTitle>
                  <CardDescription>Find legal aid centers near you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "District Legal Services Authority", location: "City Center", phone: "022-XXX-XXXX" },
                    { name: "Workers' Rights NGO", location: "Industrial Area", phone: "022-YYY-YYYY" },
                    { name: "Labor Welfare Center", location: "Sector 15", phone: "022-ZZZ-ZZZZ" }
                  ].map((center, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{center.name}</p>
                        <p className="text-xs text-muted-foreground">{center.location}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        {center.phone}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>Important numbers for immediate help</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Police Emergency", number: "100", description: "Immediate danger" },
                    { name: "Fire Service", number: "101", description: "Fire emergencies" },
                    { name: "Ambulance", number: "102", description: "Medical emergencies" },
                    { name: "Women Helpline", number: "1091", description: "Women's safety" }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="font-bold text-lg">
                        {contact.number}
                      </Button>
                    </div>
                  ))}
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

export default Legal;

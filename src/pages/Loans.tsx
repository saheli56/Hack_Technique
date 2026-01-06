import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Wallet, CreditCard, Calculator, TrendingUp, Clock, 
  CheckCircle, AlertCircle, IndianRupee, Percent, Calendar,
  ArrowRight, Phone, MessageSquare, HelpCircle, UserCheck,
  FileText, Shield, ChevronDown, ChevronUp, Search, Filter,
  Star, Heart, Eye, Zap, Award, Users, BarChart3, Target,
  BookOpen, Download, ExternalLink, CheckSquare, X
} from "lucide-react";

const sampleLoans = [
  {
    id: 1,
    name: "Quick Cash Loan",
    provider: "MicroFinance India",
    amount: "₹5,000 - ₹50,000",
    minAmount: 5000,
    maxAmount: 50000,
    interest: "12% - 18% p.a.",
    minInterest: 12,
    maxInterest: 18,
    tenure: "3 - 12 months",
    minTenure: 3,
    maxTenure: 12,
    processing: "24 hours",
    rating: 4.5,
    reviews: 1250,
    category: "emergency",
    features: ["No collateral", "Quick approval", "Flexible tenure"],
    eligibility: "18+ years, basic documents",
    popular: true,
    specialOffer: "First loan discount: 2% off"
  },
  {
    id: 2,
    name: "Worker Emergency Loan",
    provider: "Shramik Bank",
    amount: "₹10,000 - ₹1,00,000",
    minAmount: 10000,
    maxAmount: 100000,
    interest: "10% - 15% p.a.",
    minInterest: 10,
    maxInterest: 15,
    tenure: "6 - 24 months",
    minTenure: 6,
    maxTenure: 24,
    processing: "48 hours",
    rating: 4.8,
    reviews: 2100,
    category: "emergency",
    features: ["Government backed", "Low interest", "Easy documentation"],
    eligibility: "Construction workers, verified employment",
    popular: true,
    specialOffer: null
  },
  {
    id: 3,
    name: "Skill Development Loan",
    provider: "Development Credit",
    amount: "₹20,000 - ₹2,00,000",
    minAmount: 20000,
    maxAmount: 200000,
    interest: "8% - 12% p.a.",
    minInterest: 8,
    maxInterest: 12,
    tenure: "12 - 36 months",
    minTenure: 12,
    maxTenure: 36,
    processing: "3-5 days",
    rating: 4.3,
    reviews: 890,
    category: "education",
    features: ["Long tenure", "Skill certification", "Career guidance"],
    eligibility: "Enrolled in skill programs",
    popular: false,
    specialOffer: "Partner with NSDC"
  },
  {
    id: 4,
    name: "Business Startup Loan",
    provider: "Entrepreneur Bank",
    amount: "₹50,000 - ₹5,00,000",
    minAmount: 50000,
    maxAmount: 500000,
    interest: "11% - 16% p.a.",
    minInterest: 11,
    maxInterest: 16,
    tenure: "12 - 60 months",
    minTenure: 12,
    maxTenure: 60,
    processing: "7-10 days",
    rating: 4.6,
    reviews: 650,
    category: "business",
    features: ["Business plan required", "Mentorship included", "Market research support"],
    eligibility: "Business plan, market analysis",
    popular: false,
    specialOffer: "First 6 months interest-free"
  },
  {
    id: 5,
    name: "Home Construction Loan",
    provider: "Housing Finance Corp",
    amount: "₹1,00,000 - ₹10,00,000",
    minAmount: 100000,
    maxAmount: 1000000,
    interest: "9% - 13% p.a.",
    minInterest: 9,
    maxInterest: 13,
    tenure: "24 - 120 months",
    minTenure: 24,
    maxTenure: 120,
    processing: "15-20 days",
    rating: 4.4,
    reviews: 420,
    category: "housing",
    features: ["Property collateral", "Long tenure", "Construction monitoring"],
    eligibility: "Property documents, income proof",
    popular: false,
    specialOffer: null
  }
];

const loanCategories = [
  { id: "all", name: "All Loans", icon: Wallet },
  { id: "emergency", name: "Emergency", icon: Zap },
  { id: "education", name: "Education", icon: BookOpen },
  { id: "business", name: "Business", icon: Target },
  { id: "housing", name: "Housing", icon: Shield }
];

const Loans = () => {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [interestRate] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparedLoans, setComparedLoans] = useState<number[]>([]);

  // Simple EMI calculation
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - loanAmount;

  // Filter and sort loans
  const filteredLoans = sampleLoans
    .filter(loan => {
      const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           loan.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || loan.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "interest":
          return a.minInterest - b.minInterest;
        case "amount":
          return b.maxAmount - a.maxAmount;
        case "processing":
          return a.processing.localeCompare(b.processing);
        default:
          return 0;
      }
    });

  const toggleFavorite = (loanId: number) => {
    setFavorites(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  const toggleCompare = (loanId: number) => {
    setComparedLoans(prev => 
      prev.includes(loanId)
        ? prev.filter(id => id !== loanId)
        : prev.length < 3 ? [...prev, loanId] : prev
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {t('loans.hero.title')}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t('loans.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* How to Get a Loan - Step by Step Guide */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {t('loans.steps.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('loans.steps.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('loans.steps.step1.title')}</h3>
                  <p className="text-sm text-primary mb-2">{t('loans.steps.step1.subtitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('loans.steps.step1.description')}
                  </p>
                  <ArrowRight className="w-5 h-5 text-primary mx-auto mt-3 md:hidden" />
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-success" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('loans.steps.step2.title')}</h3>
                  <p className="text-sm text-primary mb-2">{t('loans.steps.step2.subtitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('loans.steps.step2.description')}
                  </p>
                  <ArrowRight className="w-5 h-5 text-success mx-auto mt-3 md:hidden" />
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-warning" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-warning text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('loans.steps.step3.title')}</h3>
                  <p className="text-sm text-primary mb-2">{t('loans.steps.step3.subtitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('loans.steps.step3.description')}
                  </p>
                  <ArrowRight className="w-5 h-5 text-warning mx-auto mt-3 md:hidden" />
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-info" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-info text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('loans.steps.step4.title')}</h3>
                  <p className="text-sm text-primary mb-2">{t('loans.steps.step4.subtitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('loans.steps.step4.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                {t('loans.steps.helpText')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t('loans.steps.callHelpline')}
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t('loans.steps.chatSupport')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Explanations */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              {t('loans.explanations.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credit Score */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('loans.explanations.creditScore.title')}</h3>
                      <p className="text-sm text-primary mb-2">{t('loans.explanations.creditScore.subtitle')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('loans.explanations.creditScore.description')}
                      </p>
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">{t('loans.explanations.creditScore.score')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Limit */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('loans.explanations.availableLimit.title')}</h3>
                      <p className="text-sm text-primary mb-2">{t('loans.explanations.availableLimit.subtitle')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('loans.explanations.availableLimit.description')}
                      </p>
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">{t('loans.explanations.availableLimit.amount')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EMI */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <IndianRupee className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('loans.explanations.emi.title')}</h3>
                      <p className="text-sm text-primary mb-2">{t('loans.explanations.emi.subtitle')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('loans.explanations.emi.description')}
                      </p>
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">{t('loans.explanations.emi.example')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Time */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('loans.explanations.processingTime.title')}</h3>
                      <p className="text-sm text-primary mb-2">{t('loans.explanations.processingTime.subtitle')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('loans.explanations.processingTime.description')}
                      </p>
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">{t('loans.explanations.processingTime.time')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Credit Overview */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Credit Score */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{t('loans.overview.creditScore.title')}</h3>
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-4xl font-bold text-success mb-2">{t('loans.overview.creditScore.score')}</div>
                  <p className="text-sm text-muted-foreground mb-4">{t('loans.overview.creditScore.status')}</p>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('loans.overview.creditScore.range')}
                  </p>
                </CardContent>
              </Card>

              {/* Available Limit */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{t('loans.overview.availableLimit.title')}</h3>
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{t('loans.overview.availableLimit.amount')}</div>
                  <p className="text-sm text-muted-foreground mb-4">{t('loans.overview.availableLimit.description')}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('loans.overview.availableLimit.button')}
                  </Button>
                </CardContent>
              </Card>

              {/* Active Loans */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{t('loans.overview.activeLoans.title')}</h3>
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">{t('loans.overview.activeLoans.count')}</div>
                  <p className="text-sm text-muted-foreground mb-4">{t('loans.overview.activeLoans.amount')}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('loans.overview.activeLoans.button')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Loan Calculator */}
              <aside className="lg:w-96 shrink-0">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      {t('loans.calculator.title')}
                    </CardTitle>
                    <CardDescription>{t('loans.calculator.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">{t('loans.calculator.amount.label')}</label>
                        <span className="text-sm text-primary font-semibold">₹{loanAmount.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="200000"
                        step="5000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{t('loans.calculator.amount.min')}</span>
                        <span>{t('loans.calculator.amount.max')}</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">{t('loans.calculator.tenure.label')}</label>
                        <span className="text-sm text-primary font-semibold">{tenure} {t('loans.calculator.tenure.unit')}</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="36"
                        step="3"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{t('loans.calculator.tenure.min')}</span>
                        <span>{t('loans.calculator.tenure.max')}</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{t('loans.calculator.interestRate.label')}</span>
                      <span className="text-sm font-semibold">{interestRate}% {t('loans.calculator.interestRate.unit')}</span>
                    </div>

                    {/* Results */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('loans.calculator.results.monthlyEMI')}</span>
                        <span className="text-xl font-bold text-primary">₹{emi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('loans.calculator.results.totalInterest')}</span>
                        <span className="font-medium">₹{totalInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('loans.calculator.results.totalAmount')}</span>
                        <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button variant="hero" className="w-full">
                      {t('loans.calculator.applyButton')}
                    </Button>
                  </CardContent>
                </Card>
              </aside>

              {/* Available Loans - Marketplace */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search loans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanCategories.map(category => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="interest">Lowest Interest</SelectItem>
                      <SelectItem value="amount">Highest Amount</SelectItem>
                      <SelectItem value="processing">Fastest Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comparison Bar */}
                {comparedLoans.length > 0 && (
                  <Card className="mb-6 bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <span className="font-medium">Comparing {comparedLoans.length} loans</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Compare Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setComparedLoans([])}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Available Loans ({filteredLoans.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{favorites.length} saved</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredLoans.map(loan => (
                    <Card key={loan.id} variant="interactive" className="relative">
                      {loan.popular && (
                        <div className="absolute -top-2 -left-2 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Popular
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Loan Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground mb-1">
                                  {loan.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">{loan.provider}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-warning text-warning" />
                                    <span className="font-medium">{loan.rating}</span>
                                    <span className="text-muted-foreground">({loan.reviews} reviews)</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {loan.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavorite(loan.id)}
                                  className={favorites.includes(loan.id) ? "text-red-500" : ""}
                                >
                                  <Heart className={`w-4 h-4 ${favorites.includes(loan.id) ? "fill-current" : ""}`} />
                                </Button>
                                <Checkbox
                                  checked={comparedLoans.includes(loan.id)}
                                  onCheckedChange={() => toggleCompare(loan.id)}
                                  disabled={!comparedLoans.includes(loan.id) && comparedLoans.length >= 3}
                                />
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                  <IndianRupee className="w-3 h-3" />
                                  Amount Range
                                </p>
                                <p className="text-sm font-medium">{loan.amount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                  <Percent className="w-3 h-3" />
                                  Interest Rate
                                </p>
                                <p className="text-sm font-medium">{loan.interest}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3" />
                                  Tenure
                                </p>
                                <p className="text-sm font-medium">{loan.tenure}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                  <Clock className="w-3 h-3" />
                                  Processing
                                </p>
                                <p className="text-sm font-medium">{loan.processing}</p>
                              </div>
                            </div>

                            {/* Features & Eligibility */}
                            <div className="space-y-2 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Key Features:</p>
                                <div className="flex flex-wrap gap-1">
                                  {loan.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      <CheckSquare className="w-3 h-3 mr-1" />
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Eligibility: {loan.eligibility}</p>
                              </div>
                            </div>
                          </div>

                          {/* Apply Section */}
                          <div className="lg:w-64 shrink-0 space-y-3">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Estimated EMI</p>
                              <p className="text-2xl font-bold text-primary">
                                ₹{Math.round((loan.minAmount * (loan.minInterest/100/12) * Math.pow(1 + loan.minInterest/100/12, loan.minTenure)) / (Math.pow(1 + loan.minInterest/100/12, loan.minTenure) - 1)).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">for {loan.minTenure} months</p>
                            </div>
                            <Button variant="default" className="w-full">
                              Apply Now
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredLoans.length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No loans found</h3>
                      <p>Try adjusting your search criteria or browse all loans.</p>
                    </div>
                  </Card>
                )}

                {/* Personalized Recommendations */}
                <Card className="mt-8 bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Recommended for You
                    </CardTitle>
                    <CardDescription>Based on your profile and recent activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <Award className="w-8 h-8 text-success mx-auto mb-2" />
                        <h4 className="font-semibold text-sm mb-1">Best Match</h4>
                        <p className="text-xs text-muted-foreground">Worker Emergency Loan</p>
                        <p className="text-xs text-success font-medium mt-1">Save ₹2,500/year</p>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <Zap className="w-8 h-8 text-warning mx-auto mb-2" />
                        <h4 className="font-semibold text-sm mb-1">Quick Approval</h4>
                        <p className="text-xs text-muted-foreground">Quick Cash Loan</p>
                        <p className="text-xs text-warning font-medium mt-1">24hr processing</p>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-info mx-auto mb-2" />
                        <h4 className="font-semibold text-sm mb-1">Lowest Interest</h4>
                        <p className="text-xs text-muted-foreground">Skill Development Loan</p>
                        <p className="text-xs text-info font-medium mt-1">8% p.a. starting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Application Tracker */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Application Tracker
                    </CardTitle>
                    <CardDescription>Track your loan applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Worker Emergency Loan</p>
                            <p className="text-xs text-muted-foreground">Application #12345</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Approved
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Skill Development Loan</p>
                            <p className="text-xs text-muted-foreground">Application #12346</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">
                          Under Review
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Applications
                    </Button>
                  </CardContent>
                </Card>

                {/* Loan FAQ Section */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      {t('loans.faq.title')}
                    </CardTitle>
                    <CardDescription>{t('loans.faq.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer py-2">
                          <span className="font-medium text-foreground">{t('loans.faq.q1.question')}</span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground group-open:hidden" />
                          <ChevronUp className="w-4 h-4 text-muted-foreground hidden group-open:block" />
                        </summary>
                        <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/20">
                          {t('loans.faq.q1.answer')}
                        </p>
                      </details>

                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer py-2">
                          <span className="font-medium text-foreground">{t('loans.faq.q2.question')}</span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground group-open:hidden" />
                          <ChevronUp className="w-4 h-4 text-muted-foreground hidden group-open:block" />
                        </summary>
                        <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/20">
                          {t('loans.faq.q2.answer')}
                        </p>
                      </details>

                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer py-2">
                          <span className="font-medium text-foreground">{t('loans.faq.q3.question')}</span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground group-open:hidden" />
                          <ChevronUp className="w-4 h-4 text-muted-foreground hidden group-open:block" />
                        </summary>
                        <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/20">
                          {t('loans.faq.q3.answer')}
                        </p>
                      </details>

                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer py-2">
                          <span className="font-medium text-foreground">{t('loans.faq.q4.question')}</span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground group-open:hidden" />
                          <ChevronUp className="w-4 h-4 text-muted-foreground hidden group-open:block" />
                        </summary>
                        <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary/20">
                          {t('loans.faq.q4.answer')}
                        </p>
                      </details>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="mt-6 bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">{t('loans.disclaimer.title')}</p>
                        <p>
                          {t('loans.disclaimer.content')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Document Requirements & Special Offers */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Document Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Required Documents
                  </CardTitle>
                  <CardDescription>Documents needed for loan application</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="address">Address</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Aadhaar Card</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">PAN Card</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Recent Photograph</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="income" className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Salary Slips (3 months)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Bank Statements (6 months)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Employment Letter</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="address" className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Utility Bill (Electricity/Gas)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Rent Agreement (if rented)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded">
                        <CheckSquare className="w-4 h-4 text-success" />
                        <span className="text-sm">Voter ID Card</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download Checklist
                  </Button>
                </CardContent>
              </Card>

              {/* Special Offers & Promotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning" />
                    Special Offers
                  </CardTitle>
                  <CardDescription>Limited time offers and promotions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-warning" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">New User Bonus</h4>
                        <p className="text-xs text-muted-foreground mb-2">Get ₹500 cashback on first loan</p>
                        <Badge variant="secondary" className="text-xs">Valid till Dec 31, 2025</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Refer & Earn</h4>
                        <p className="text-xs text-muted-foreground mb-2">Earn ₹200 for each successful referral</p>
                        <Badge variant="secondary" className="text-xs">Ongoing</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-info/10 to-info/5 border border-info/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-info" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Festival Offer</h4>
                        <p className="text-xs text-muted-foreground mb-2">Reduced interest rates during festivals</p>
                        <Badge variant="secondary" className="text-xs">Seasonal</Badge>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All Offers
                  </Button>
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

export default Loans;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Chatbot } from "@/components/Chatbot";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Community from "./pages/Community";
import Legal from "./pages/Legal";
import Loans from "./pages/Loans";
import IVR from "./pages/IVR";
import IVRSimulator from "./pages/IVRSimulator";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployerSignup from "./pages/EmployerSignup";
import EmployerLogin from "./pages/EmployerLogin";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerApplications from "./pages/EmployerApplications";
import JobPostingForm from "./pages/JobPostingForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/ivr" element={<IVR />} />
            <Route path="/ivr-simulator" element={<IVRSimulator />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employer-signup" element={<EmployerSignup />} />
            <Route path="/employer-login" element={<EmployerLogin />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/employer-applications" element={<EmployerApplications />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

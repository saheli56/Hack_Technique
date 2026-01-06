import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Minimize2,
  Maximize2,
  Languages
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini, ChatMessage, Job } from "@/lib/geminiApi";
import { useTranslation } from "@/hooks/useTranslation";
import { jobsAPI } from "@/lib/api";

// Get API key from environment or use a placeholder
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export function Chatbot() {
  const { t, language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [chatbotLanguage, setChatbotLanguage] = useState("en");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await jobsAPI.getAll();
        setJobs(jobData);
      } catch (error) {
        console.error('Failed to fetch jobs for chatbot:', error);
        // Continue without jobs - chatbot can still provide general help
      }
    };
    fetchJobs();
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const toggleLanguage = () => {
    setChatbotLanguage(chatbotLanguage === "en" ? "hi" : "en");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setHasError(false);

    if (!GEMINI_API_KEY) {
      // Demo mode - show helpful response without API
      setTimeout(() => {
        const demoResponse: ChatMessage = {
          role: "model",
          content: chatbotLanguage === "hi" 
            ? "क्षमा करें, चैटबॉट अभी कॉन्फ़िगर नहीं है। कृपया बाद में प्रयास करें या हमारी IVR हेल्पलाइन पर कॉल करें: 1800-XXX-XXXX"
            : "Sorry, the chatbot is not configured yet. Please try again later or call our IVR helpline: 1800-XXX-XXXX"
        };
        setMessages(prev => [...prev, demoResponse]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    const response = await sendMessageToGemini(
      [...messages, userMessage],
      chatbotLanguage,
      GEMINI_API_KEY,
      jobs
    );

    if (response.success) {
      const botMessage: ChatMessage = {
        role: "model",
        content: response.message
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      setHasError(true);
      const errorMessage: ChatMessage = {
        role: "model",
        content: chatbotLanguage === "hi"
          ? "क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
          : "Sorry, something went wrong. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { 
      en: "Find Jobs", 
      hi: "नौकरी खोजें",
      query: chatbotLanguage === "hi" ? "मुझे नौकरी खोजने में मदद करें" : "Help me find a job"
    },
    { 
      en: "Legal Help", 
      hi: "कानूनी मदद",
      query: chatbotLanguage === "hi" ? "मुझे कानूनी सहायता चाहिए" : "I need legal assistance"
    },
    { 
      en: "Loan Info", 
      hi: "लोन जानकारी",
      query: chatbotLanguage === "hi" ? "लोन के बारे में जानकारी दें" : "Tell me about loan options"
    },
  ];

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  // Minimized state - just show header
  if (isMinimized) {
    return (
      <Card className="fixed bottom-6 right-6 w-72 shadow-xl z-50 cursor-pointer" onClick={() => { setIsMinimized(false); setIsMaximized(false); }}>
        <CardHeader className="p-3 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">{t("chatbot.title")}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`fixed shadow-xl z-50 flex flex-col transition-all duration-300 ${
      isMaximized 
        ? "inset-4 w-auto h-auto max-w-none" 
        : "bottom-6 right-6 w-80 sm:w-96 h-[500px]"
    }`}>
      {/* Header */}
      <CardHeader className="p-3 bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-sm font-medium">{t("chatbot.title")}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={toggleLanguage}
              title={chatbotLanguage === "en" ? "Switch to Hindi" : "English में बदलें"}
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleMaximize}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleMinimize}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                {t("chatbot.welcomeMessage")}
              </p>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">{t("chatbot.quickActions")}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickAction(action.query)}
                    >
                      {chatbotLanguage === "hi" ? action.hi : action.en}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }>
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      message.content
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={t("chatbot.inputPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t("chatbot.poweredBy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

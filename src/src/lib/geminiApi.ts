    // Gemini API configuration for chatbot
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface Job {
  _id: string;
  title: string;
  titleHi?: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  applicants: number;
  posted: string;
  verified?: boolean;
  description?: string;
}

export interface GeminiResponse {
  success: boolean;
  message: string;
  error?: string;
}

// System prompt to guide the chatbot behavior
const getSystemPrompt = (language: string, jobListings?: Job[]) => {
  let jobInfo = "";
  if (jobListings && jobListings.length > 0) {
    const jobSummary = jobListings.map(job => 
      `- ${job.title} at ${job.company} in ${job.location}, salary: ${job.salary}, type: ${job.type}`
    ).join('\n');
    
    jobInfo = `\n\nAvailable jobs:\n${jobSummary}`;
  }
  
  return `You are a helpful assistant for ShramikMitra - a platform for migrant workers in India. You can help with:
- Finding and applying for jobs
- Information about legal rights and labor laws
- Guidance on loans and financial assistance
- Community and support resources

IMPORTANT: Always respond in the SAME LANGUAGE that the user uses in their question. If the user asks in Hindi, respond in Hindi. If they ask in English, respond in English. Use simple, easy-to-understand language suitable for workers. Keep responses concise and helpful.${jobInfo}`;
};

export async function sendMessageToGemini(
  messages: ChatMessage[],
  language: string = "en",
  apiKey: string,
  jobListings?: Job[]
): Promise<GeminiResponse> {
  try {
    const systemPrompt = getSystemPrompt(language, jobListings);
    
    // Format messages for Gemini API
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "Hello! I'm your ShramikMitra assistant. How can I help you today?" }]
      },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from Gemini");
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return {
        success: true,
        message: data.candidates[0].content.parts[0].text
      };
    }

    throw new Error("Invalid response format from Gemini");
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      success: false,
      message: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

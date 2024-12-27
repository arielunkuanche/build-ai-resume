import { GoogleGenerativeAI } from '@google/generative-ai'; // not using require as in documentation
    
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",  // as our prompt is in JSON format so replace the original responseMimeType:'text/plain'
};

export const AIChatSession = model.startChat({
    generationConfig,
    history: [
    ],
});


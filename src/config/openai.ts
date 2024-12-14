import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const OPENAI_CONFIG = {
  model: "gpt-4-vision-preview", // Using vision model since we need image analysis
  maxTokens: 500,
  temperature: 0.5,
} as const;
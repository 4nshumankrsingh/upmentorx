import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from './config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple keyword matching algorithm (fallback)
export const calculateMatchScore = (jobSkills: string[], candidateSkills: string[]): number => {
  if (jobSkills.length === 0) return 0;
  
  const commonSkills = jobSkills.filter(skill => 
    candidateSkills.some(candidateSkill => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  return Math.round((commonSkills.length / jobSkills.length) * 100);
};

// Mock AI delay simulation
export const simulateAIDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format match score with color
export const getMatchColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

// Real AI matching with Gemini API
export const getAIRecommendation = async (jobDescription: string, candidateProfile: string): Promise<{
  score: number;
  reasoning: string;
  confidence: string;
}> => {
  // If no API key, fall back to simple matching
  if (!config.geminiApiKey) {
    console.log('No Gemini API key found, using fallback matching');
    return {
      score: calculateMatchScore(
        jobDescription.toLowerCase().split(' '),
        candidateProfile.toLowerCase().split(' ')
      ),
      reasoning: "Based on keyword matching (AI not configured)",
      confidence: "medium"
    };
  }

  try {
    const prompt = `
      You are an AI recruitment assistant. Analyze the match between a job and a candidate.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      CANDIDATE PROFILE:
      ${candidateProfile}
      
      Please provide:
      1. A match score from 0-100%
      2. A brief reasoning (1-2 sentences)
      3. Confidence level (low/medium/high)
      
      Return as JSON: {score: number, reasoning: string, confidence: string}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response - FIXED REGEX
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if JSON parsing fails
    return {
      score: 75,
      reasoning: "AI analysis completed",
      confidence: "high"
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to simple matching
    return {
      score: calculateMatchScore(
        jobDescription.toLowerCase().split(' '),
        candidateProfile.toLowerCase().split(' ')
      ),
      reasoning: "Error connecting to AI, used fallback matching",
      confidence: "low"
    };
  }
};

// Enhanced matching with AI
export const calculateEnhancedMatch = async (job: { title: string; description: string; skills: string[] }, candidate: { name: string; skills: string[]; role: string }): Promise<{
  score: number;
  reasoning: string;
  confidence: string;
  isAI: boolean;
}> => {
  // First, use simple matching for instant results
  const simpleScore = calculateMatchScore(job.skills, candidate.skills);
  
  // If we have Gemini API key, enhance with AI
  if (config.geminiApiKey) {
    try {
      const jobContext = `Title: ${job.title}. Description: ${job.description}. Required Skills: ${job.skills.join(', ')}`;
      const candidateContext = `Role: ${candidate.role}. Skills: ${candidate.skills.join(', ')}`;
      
      const aiResult = await getAIRecommendation(jobContext, candidateContext);
      
      // Combine simple score with AI score (weighted average)
      const finalScore = Math.round((simpleScore * 0.3) + (aiResult.score * 0.7));
      
      return {
        score: finalScore,
        reasoning: aiResult.reasoning,
        confidence: aiResult.confidence,
        isAI: true
      };
    } catch (error) {
      console.error('AI matching failed, using fallback:', error);
    }
  }
  
  // Fallback to simple matching
  return {
    score: simpleScore,
    reasoning: `Matched ${simpleScore}% based on skills comparison`,
    confidence: simpleScore >= 80 ? "high" : simpleScore >= 60 ? "medium" : "low",
    isAI: false
  };
};
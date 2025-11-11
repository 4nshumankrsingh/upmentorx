import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple keyword matching algorithm (mock AI)
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
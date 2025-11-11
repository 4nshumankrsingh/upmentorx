import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple keyword matching algorithm (mock AI)
export const calculateMatchScore = (jobSkills: string[], candidateSkills: string[]): number => {
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
import { create } from 'zustand';
import { Job, Candidate } from '@/lib/types';
import { mockJobs, mockCandidates } from '@/lib/mockData';
import { calculateMatchScore, calculateEnhancedMatch } from '@/lib/utils';

interface JobStore {
  jobs: Job[];
  candidates: Candidate[];
  selectedJob: Job | null;
  isAILoading: boolean;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: number, job: Partial<Job>) => void;
  deleteJob: (id: number) => void;
  setSelectedJob: (job: Job | null) => void;
  getCandidatesForJob: (jobId: number) => Candidate[];
  getEnhancedMatches: (jobId: number) => Promise<Array<Candidate & { 
    aiReasoning?: string; 
    confidence?: string;
    isAI?: boolean;
  }>>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate' | 'matchScore'>) => void;
  updateCandidateStatus: (candidateId: number, newStatus: Candidate['status']) => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: mockJobs,
  candidates: mockCandidates,
  selectedJob: null,
  isAILoading: false,
  
  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      jobs: [...state.jobs, newJob],
    }));
  },
  
  updateJob: (id, jobData) => {
    set((state) => ({
      jobs: state.jobs.map(job =>
        job.id === id ? { ...job, ...jobData } : job
      ),
    }));
  },
  
  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter(job => job.id !== id),
      selectedJob: state.selectedJob?.id === id ? null : state.selectedJob,
    }));
  },
  
  setSelectedJob: (job) => {
    set({ selectedJob: job });
  },
  
  getCandidatesForJob: (jobId) => {
    const state = get();
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return [];
    
    return state.candidates.map(candidate => ({
      ...candidate,
      matchScore: calculateMatchScore(job.skills, candidate.skills),
    }));
  },

  getEnhancedMatches: async (jobId) => {
    const state = get();
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return [];

    set({ isAILoading: true });

    const enhancedCandidates = await Promise.all(
      state.candidates.map(async (candidate) => {
        const enhancedMatch = await calculateEnhancedMatch(job, candidate);
        return {
          ...candidate,
          matchScore: enhancedMatch.score,
          aiReasoning: enhancedMatch.reasoning,
          confidence: enhancedMatch.confidence,
          isAI: enhancedMatch.isAI,
        };
      })
    );

    set({ isAILoading: false });
    return enhancedCandidates.sort((a, b) => b.matchScore - a.matchScore);
  },
  
  addCandidate: (candidateData) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: Date.now(),
      appliedDate: new Date().toISOString(),
      matchScore: 0,
    };
    
    set((state) => ({
      candidates: [...state.candidates, newCandidate],
    }));
  },
  
  updateCandidateStatus: (candidateId, newStatus) => {
    set((state) => ({
      candidates: state.candidates.map(candidate =>
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus }
          : candidate
      ),
    }));
  },
}));
export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
}

export interface Candidate {
  id: number;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  status: 'Applied' | 'Screened' | 'Interview' | 'Hired';
  email: string;
  appliedDate: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  color: string;
}

export interface Filters {
  minMatchScore: number;
  status: Candidate['status'] | '';
  skills: string;
}
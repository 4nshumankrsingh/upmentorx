import { Job, Candidate, PipelineStage } from '@/lib/types';

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer with experience in React and TypeScript.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Data Scientist",
    description: "Join our data team to build machine learning models and analyze complex datasets.",
    skills: ["Python", "Machine Learning", "SQL", "Pandas"],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    description: "Develop end-to-end features for our web applications.",
    skills: ["Node.js", "React", "MongoDB", "Express"],
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "JavaScript"],
    matchScore: 85,
    status: "Applied",
    email: "priya@example.com",
    appliedDate: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Rahul Kumar",
    role: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    matchScore: 92,
    status: "Screened",
    email: "rahul@example.com",
    appliedDate: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Anjali Patel",
    role: "Full Stack Engineer",
    skills: ["Node.js", "React", "MongoDB", "TypeScript"],
    matchScore: 78,
    status: "Interview",
    email: "anjali@example.com",
    appliedDate: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    matchScore: 65,
    status: "Applied",
    email: "vikram@example.com",
    appliedDate: new Date().toISOString(),
  },
];

export const pipelineStages: PipelineStage[] = [
  { id: "applied", title: "Applied", color: "bg-blue-100 text-blue-800" },
  { id: "screened", title: "Screened", color: "bg-purple-100 text-purple-800" },
  { id: "interview", title: "Interview", color: "bg-yellow-100 text-yellow-800" },
  { id: "hired", title: "Hired", color: "bg-green-100 text-green-800" },
];
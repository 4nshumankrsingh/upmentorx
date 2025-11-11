'use client';

import { Job } from '@/lib/types';
import { useJobStore } from '@/lib/stores/jobStore';
import { Button } from '@/components/ui/button';
import { Users, Trash2, ChevronRight } from 'lucide-react';
import { calculateMatchScore } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onViewCandidates?: () => void;
}

export default function JobCard({ job, onViewCandidates }: JobCardProps) {
  const { deleteJob, setSelectedJob, candidates } = useJobStore();

  const matchingCandidates = candidates.filter(candidate =>
    calculateMatchScore(job.skills, candidate.skills) >= 60
  ).length;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      deleteJob(job.id);
    }
  };

  const handleViewCandidates = () => {
    setSelectedJob(job);
    if (onViewCandidates) onViewCandidates();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h4>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-gray-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{matchingCandidates} matches</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            job.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleViewCandidates}>
          View Candidates
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
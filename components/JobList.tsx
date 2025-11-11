'use client';

import { useJobStore } from '@/lib/stores/jobStore';
import JobCard from './JobCard';
import { Briefcase } from 'lucide-react';

interface JobListProps {
  onViewCandidates?: () => void;
}

export default function JobList({ onViewCandidates }: JobListProps) {
  const { jobs } = useJobStore();

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Created</h3>
        <p className="text-gray-600 mb-4">Create your first job to start matching with candidates</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Jobs ({jobs.length})</h3>
        <div className="text-sm text-gray-600">
          Sorted by: <span className="font-medium">Recently Added</span>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onViewCandidates={onViewCandidates}
          />
        ))}
      </div>
    </div>
  );
}
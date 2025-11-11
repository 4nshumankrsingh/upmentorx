'use client';

import { useJobStore } from '@/lib/stores/jobStore';
import { Button } from '@/components/ui/button';
import { X, User, Star } from 'lucide-react';
import { getMatchColor } from '@/lib/utils';

export default function CandidateMatch() {
  const { selectedJob, setSelectedJob, getCandidatesForJob } = useJobStore();

  if (!selectedJob) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Job</h3>
        <p className="text-gray-600">Choose a job to view matching candidates</p>
      </div>
    );
  }

  const candidates = getCandidatesForJob(selectedJob.id)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Candidates for {selectedJob.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {candidates.length} candidates sorted by match score
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                <p className="text-sm text-gray-600">{candidate.role}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{candidate.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(candidate.matchScore)}`}>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{candidate.matchScore}% Match</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                candidate.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                candidate.status === 'Screened' ? 'bg-purple-100 text-purple-800' :
                candidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {candidate.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Candidates Found</h4>
          <p className="text-gray-600">No candidates match the skills required for this job.</p>
        </div>
      )}
    </div>
  );
}
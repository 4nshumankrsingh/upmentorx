'use client';

import { useJobStore } from '@/lib/stores/jobStore';
import PipelineColumn from './PipelineColumn';
import { pipelineStages } from '@/lib/mockData';

export default function Pipeline() {
  const { candidates, selectedJob } = useJobStore();

  // Filter candidates for selected job if any
  const displayCandidates = selectedJob 
    ? candidates.filter(candidate => 
        candidate.role.toLowerCase().includes(selectedJob.title.toLowerCase()) ||
        candidate.skills.some(skill => 
          selectedJob.skills.some(js => 
            js.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    : candidates;

  if (!selectedJob) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Job</h3>
        <p className="text-gray-600">Choose a job to view its candidate pipeline</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Candidate Pipeline</h3>
          <p className="text-gray-600 text-sm">
            {displayCandidates.length} candidates for {selectedJob.title}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Drag and drop to update status
        </div>
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <PipelineColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            color={stage.color}
            candidates={displayCandidates.filter(c => c.status === stage.title)}
          />
        ))}
      </div>
    </div>
  );
}
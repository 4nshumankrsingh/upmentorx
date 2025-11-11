'use client';

import { useDroppable } from '@dnd-kit/core';
import { Candidate } from '@/lib/types';
import DraggableCandidateCard from './DraggableCandidateCard';

interface PipelineColumnProps {
  id: string;
  title: string;
  color: string;
  candidates: Candidate[];
}

export default function PipelineColumn({ id, title, color, candidates }: PipelineColumnProps) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: `pipeline-${id}`, // Keep pipeline prefix for columns
    data: {
      type: 'pipeline-column',
      status: title,
    },
  });

  return (
    <div className="flex-1 min-w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-gray-900 ${color} px-3 py-1 rounded-full`}>
          {title}
        </h3>
        <span className="bg-gray-100 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
          {candidates.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`min-h-96 rounded-lg border-2 border-dashed transition-colors ${
          isOver 
            ? 'border-orange-300 bg-orange-50' 
            : 'border-gray-200 bg-gray-50'
        } p-3 space-y-3`}
      >
        {candidates.map((candidate) => (
          <DraggableCandidateCard key={candidate.id} candidate={candidate} />
        ))}
        
        {candidates.length === 0 && (
          <div className="h-32 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-sm mb-1">Drop candidates here</p>
              <p className="text-xs text-gray-400">Drag from candidate list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
    id,
    data: {
      type: 'column',
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
        className={`h-96 overflow-y-auto rounded-lg border-2 border-dashed transition-colors ${
          isOver 
            ? 'border-orange-300 bg-orange-50' 
            : 'border-gray-200 bg-gray-50'
        } p-3 space-y-3`}
      >
        <SortableContext items={candidates.map(c => c.id.toString())} strategy={verticalListSortingStrategy}>
          {candidates.map((candidate) => (
            <DraggableCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
        
        {candidates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Drop candidates here</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Candidate } from '@/lib/types';
import { User } from 'lucide-react';
import { getMatchColor } from '@/lib/utils';

interface DraggableCandidateCardProps {
  candidate: Candidate;
}

export default function DraggableCandidateCard({ candidate }: DraggableCandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: candidate.id, // Use just the numeric ID, consistent with list items
    data: {
      type: 'candidate',
      candidate,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-orange-600" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{candidate.name}</h4>
            <p className="text-gray-600 text-xs truncate">{candidate.role}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(candidate.matchScore)}`}>
          {candidate.matchScore}%
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {candidate.skills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {candidate.skills.length > 2 && (
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
            +{candidate.skills.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}
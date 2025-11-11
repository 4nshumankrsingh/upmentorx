'use client';

import { useDraggable } from '@dnd-kit/core';
import { Candidate } from '@/lib/types';
import { User, Star, Sparkles } from 'lucide-react';
import { getMatchColor } from '@/lib/utils';

interface DraggableCandidateListItemProps {
  candidate: Candidate & { aiReasoning?: string; confidence?: string; isAI?: boolean };
}

export default function DraggableCandidateListItem({ candidate }: DraggableCandidateListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: candidate.id, // Use just the numeric ID, not prefixed
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
      className={`p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-lg bg-orange-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">{candidate.name}</h4>
              {candidate.isAI && (
                <Sparkles className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{candidate.role}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {candidate.skills.slice(0, 3).map((skill: string) => (
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
            {candidate.aiReasoning && (
              <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded mt-2 flex items-start space-x-1">
                <Sparkles className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                <span>{candidate.aiReasoning}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
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
          {candidate.confidence && (
            <div className={`text-xs px-2 py-1 rounded ${
              candidate.confidence === 'high' ? 'bg-green-100 text-green-800' :
              candidate.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Confidence: {candidate.confidence}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
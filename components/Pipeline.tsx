'use client';

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useJobStore } from '@/lib/stores/jobStore';
import PipelineColumn from './PipelineColumn';
import { pipelineStages } from '@/lib/mockData';
import { useState } from 'react';

export default function Pipeline() {
  const { candidates, updateCandidateStatus, selectedJob } = useJobStore();
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const candidateId = parseInt(active.id as string);
    const newStatus = over.data.current?.status;

    if (newStatus && ['Applied', 'Screened', 'Interview', 'Hired'].includes(newStatus)) {
      updateCandidateStatus(candidateId, newStatus as any);
    }
  };

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

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-6 overflow-x-auto pb-4">
          <SortableContext items={pipelineStages.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            {pipelineStages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                color={stage.color}
                candidates={displayCandidates.filter(c => c.status === stage.title)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
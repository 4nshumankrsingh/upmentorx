"use client";

import { useState } from 'react';
import { useJobStore } from '@/lib/stores/jobStore';
import { Button } from '@/components/ui/button';
import { X, User, Star, Brain, Sparkles, Loader2 } from 'lucide-react';
import { getMatchColor, calculateEnhancedMatch } from '@/lib/utils';
import type { Candidate } from '@/lib/types';
import DraggableCandidateListItem from './DraggableCandidateListItem';

export default function AICandidateMatch() {
  const { selectedJob, setSelectedJob, getCandidatesForJob } = useJobStore();
  const [enhancedCandidates, setEnhancedCandidates] = useState<Array<Candidate & {
    aiReasoning?: string;
    confidence?: string;
    isAI?: boolean;
  }>>([]);
  const [useAI, setUseAI] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIMatching = async () => {
    if (!selectedJob) return;
    
    setIsAnalyzing(true);
    setUseAI(true);
    
    const simpleCandidates = getCandidatesForJob(selectedJob.id);
    const enhancedResults: Array<Candidate & { aiReasoning?: string; confidence?: string; isAI?: boolean; }> = [];

    for (const candidate of simpleCandidates) {
      const enhancedMatch = await calculateEnhancedMatch(
        {
          title: selectedJob.title,
          description: selectedJob.description,
          skills: selectedJob.skills
        },
        {
          name: candidate.name,
          skills: candidate.skills,
          role: candidate.role
        }
      );
      
      enhancedResults.push({
        ...candidate,
        matchScore: enhancedMatch.score,
        aiReasoning: enhancedMatch.reasoning,
        confidence: enhancedMatch.confidence,
        isAI: enhancedMatch.isAI,
      });
    }

    setEnhancedCandidates(enhancedResults.sort((a, b) => b.matchScore - a.matchScore));
    setIsAnalyzing(false);
  };

  const handleSimpleMatching = () => {
    setUseAI(false);
    setEnhancedCandidates([]);
  };

  if (!selectedJob) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Job</h3>
        <p className="text-gray-600">Choose a job to view matching candidates</p>
      </div>
    );
  }

  const simpleCandidates = getCandidatesForJob(selectedJob.id)
    .sort((a, b) => b.matchScore - a.matchScore);

  const candidates = (useAI ? enhancedCandidates : simpleCandidates) as Array<Candidate & { aiReasoning?: string; confidence?: string; isAI?: boolean }>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Candidates for {selectedJob.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {candidates.length} candidates • {useAI ? 'AI-Powered Matching' : 'Simple Matching'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Toggle */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Brain className="w-5 h-5 text-orange-600" />
          <div>
            <p className="font-medium text-gray-900">AI-Powered Matching</p>
            <p className="text-sm text-gray-600">
              {useAI ? 'Using Gemini AI for enhanced analysis' : 'Using keyword-based matching'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={!useAI ? "default" : "outline"}
            size="sm"
            onClick={handleSimpleMatching}
            disabled={isAnalyzing}
          >
            Simple
          </Button>
          <Button
            variant={useAI ? "default" : "outline"}
            size="sm"
            onClick={handleAIMatching}
            disabled={isAnalyzing}
            className="min-w-24"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI...
              </>
            ) : (
              'AI Match'
            )}
          </Button>
        </div>
      </div>

      {/* AI Analysis Indicator */}
      {isAnalyzing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">AI is analyzing candidates with Gemini...</span>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <DraggableCandidateListItem key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {candidates.length === 0 && !isAnalyzing && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Candidates Found</h4>
          <p className="text-gray-600">No candidates match the skills required for this job.</p>
        </div>
      )}
    </div>
  );
}
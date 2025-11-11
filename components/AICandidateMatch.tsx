"use client";

import { useState } from 'react';
import { useJobStore } from '@/lib/stores/jobStore';
import { Button } from '@/components/ui/button';
import { X, User, Star, Brain, Sparkles, Loader2 } from 'lucide-react';
import { getMatchColor, calculateEnhancedMatch } from '@/lib/utils';
import type { Candidate } from '@/lib/types';

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
          <div key={candidate.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
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
                    <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded mt-2">
                      💡 {candidate.aiReasoning}
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
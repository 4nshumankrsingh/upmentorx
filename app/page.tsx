'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import JobForm from '@/components/JobForm';
import JobList from '@/components/JobList';
import CandidateMatch from '@/components/CandidateMatch';
import { useJobStore } from '@/lib/stores/jobStore';
import { Briefcase, Users, Target, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import AICandidateMatch from '@/components/AICandidateMatch';

export default function Dashboard() {
  const [showJobForm, setShowJobForm] = useState(false);
  const { jobs, candidates } = useJobStore();

  const totalMatches = candidates.filter(c => c.matchScore >= 60).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <Button onClick={() => setShowJobForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Jobs"
              value={jobs.length.toString()}
              icon={Briefcase}
              color="orange"
              trend="+2 this week"
            />
            <StatsCard
              title="Candidates"
              value={candidates.length.toString()}
              icon={Users}
              color="blue"
              trend="+8 today"
            />
            <StatsCard
              title="Matches"
              value={totalMatches.toString()}
              icon={Target}
              color="green"
              trend="85% rate"
            />
            <StatsCard
              title="Avg. Time-to-Hire"
              value="14 days"
              icon={Clock}
              color="purple"
              trend="-2 days"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Creation Form */}
            {showJobForm ? (
              <JobForm onClose={() => setShowJobForm(false)} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <Button onClick={() => setShowJobForm(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Job
                </Button>
              </div>
            )}

            {/* Job List */}
            <JobList />
          </div>

          {/* Right Column - Candidate Matching */}
          <div className="space-y-8">
            <AICandidateMatch />
            
            {/* Progress Indicator */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Development Progress</h3>
                  <p className="text-gray-600 mt-1">Phase 3 of 5 completed - Job Management System</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Bell, Search, User, Rocket, Briefcase, Users, Target, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import JobForm from '@/components/JobForm';
import JobList from '@/components/JobList';
import AICandidateMatch from '@/components/AICandidateMatch';
import Pipeline from '@/components/Pipeline';
import AddCandidateForm from '@/components/AddCandidateForm';
import SmartFilters from '@/components/SmartFilters';
import { useJobStore } from '@/lib/stores/jobStore';
import { pipelineStages } from '@/lib/mockData';
import { AvatarIcon } from "@radix-ui/react-icons";

// Header Component
function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Rocket className="text-white w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">UpMentor-X Hire</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs, candidates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User Profile & Notifications */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Recruiter</p>
              <p className="text-gray-500">admin@upmentorx.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Dashboard() {
  const [showJobForm, setShowJobForm] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const { jobs, candidates, selectedJob, updateCandidateStatus } = useJobStore();

  const totalMatches = candidates.filter(c => c.matchScore >= 60).length;
  const hiredCandidates = candidates.filter(c => c.status === 'Hired').length;

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('=== DRAG DEBUG ===');
    console.log('Active:', {
      id: active.id,
      data: active.data.current
    });
    console.log('Over:', {
      id: over?.id,
      data: over?.data.current
    });

    if (!over) {
      console.log('No drop target');
      return;
    }

    // Extract candidate ID from active element
    let candidateId: number;
    
    if (typeof active.id === 'number') {
      candidateId = active.id;
    } else if (typeof active.id === 'string' && !isNaN(Number(active.id))) {
      candidateId = parseInt(active.id);
    } else {
      console.log('Unknown active ID format:', active.id);
      return;
    }

    const newStatus = over.data.current?.status;

    console.log('Parsed values:', { candidateId, newStatus });

    if (newStatus && ['Applied', 'Screened', 'Interview', 'Hired'].includes(newStatus)) {
      console.log(`Updating candidate ${candidateId} to status: ${newStatus}`);
      updateCandidateStatus(candidateId, newStatus as any);
    } else {
      console.log('Invalid status or missing data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowAddCandidate(true)}>
                <User className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
              <Button onClick={() => setShowJobForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Jobs"
              value={jobs.length.toString()}
              icon={Briefcase}
              color="orange"
              trend={jobs.length > 0 ? `${jobs.length} active` : 'No jobs yet'}
            />
            <StatsCard
              title="Candidates"
              value={candidates.length.toString()}
              icon={Users}
              color="blue"
              trend={hiredCandidates > 0 ? `${hiredCandidates} hired` : 'Growing network'}
            />
            <StatsCard
              title="AI Matches"
              value={totalMatches.toString()}
              icon={Target}
              color="green"
              trend={totalMatches > 0 ? 'Strong matches' : 'Ready to match'}
            />
            <StatsCard
              title="Hiring Speed"
              value="14 days"
              icon={Clock}
              color="purple"
              trend="Industry average"
            />
          </div>
        </section>

        {/* Smart Filters */}
        <section className="mb-8">
          <SmartFilters onFilterChange={handleFilterChange} />
        </section>

        {/* Main Content Grid with Single DndContext */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Management */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Creation Form */}
              {showJobForm ? (
                <JobForm onClose={() => setShowJobForm(false)} />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Post a New Job?</h3>
                  <p className="text-gray-600 mb-4">Create a job listing to start finding perfect candidates</p>
                  <Button onClick={() => setShowJobForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Job
                  </Button>
                </div>
              )}

              {/* Add Candidate Form */}
              {showAddCandidate && (
                <AddCandidateForm onClose={() => setShowAddCandidate(false)} />
              )}

              {/* Job List */}
              <JobList />

              {/* Pipeline for Selected Job */}
              {selectedJob && <Pipeline />}
            </div>

            {/* Right Column - AI Matching */}
            <div className="space-y-8">
              <AICandidateMatch />
              
              {/* Demo Completion */}
              <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-semibold">Prototype Complete</h3>
                    <p className="text-orange-100 text-sm">All features implemented and ready</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-orange-100">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Job Management System</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Drag & Drop Pipeline</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI-Powered Matching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Smart Filters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Candidate Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Professional UI</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </DndContext>
      </main>
    </div>
  );
}
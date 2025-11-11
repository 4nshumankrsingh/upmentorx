import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { Briefcase, Users, Target, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Jobs"
              value="12"
              icon={Briefcase}
              color="orange"
              trend="+2 this week"
            />
            <StatsCard
              title="Candidates"
              value="48"
              icon={Users}
              color="blue"
              trend="+8 today"
            />
            <StatsCard
              title="Matches"
              value="32"
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
          {/* Job Management Section - Will be 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Creation - Coming in Phase 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Management</h3>
              <p className="text-gray-600">Job creation form will be implemented in Phase 3</p>
            </div>

            {/* Job List - Coming in Phase 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Jobs</h3>
              <p className="text-gray-600">Job listings will be implemented in Phase 3</p>
            </div>
          </div>

          {/* Candidate Pipeline - Coming in Phase 4 */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Pipeline</h3>
              <p className="text-gray-600">Kanban board with drag & drop coming in Phase 4</p>
            </div>

            {/* AI Matching - Coming in Phase 4 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Matching</h3>
              <p className="text-gray-600">AI-powered candidate matching coming in Phase 4</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Development Progress</h3>
              <p className="text-gray-600 mt-1">Phase 2 of 5 completed - Core Layout & UI Components</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-sm font-medium text-gray-700">40%</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
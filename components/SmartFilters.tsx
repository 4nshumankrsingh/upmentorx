'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, Sparkles } from 'lucide-react';

interface SmartFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function SmartFilters({ onFilterChange }: SmartFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minMatchScore: 0,
    status: '',
    skills: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { minMatchScore: 0, status: '', skills: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.minMatchScore > 0 || filters.status || filters.skills;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Smart Filters</h3>
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
        <div className="flex space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Match Score Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Match Score: {filters.minMatchScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={filters.minMatchScore}
              onChange={(e) => handleFilterChange('minMatchScore', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Screened">Screened</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Contains
            </label>
            <input
              type="text"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., React, Python"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {filters.minMatchScore > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Match ≥ {filters.minMatchScore}%
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Status: {filters.status}
            </span>
          )}
          {filters.skills && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Skills: {filters.skills}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
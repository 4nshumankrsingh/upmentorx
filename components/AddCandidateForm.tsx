'use client';

import { useState } from 'react';
import { useJobStore } from '@/lib/stores/jobStore';
import { Button } from '@/components/ui/button';
import { X, Plus, User } from 'lucide-react';

interface AddCandidateFormProps {
  onClose?: () => void;
}

export default function AddCandidateForm({ onClose }: AddCandidateFormProps) {
  const { addCandidate, jobs } = useJobStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [status, setStatus] = useState<'Applied' | 'Screened' | 'Interview' | 'Hired'>('Applied');

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || skills.length === 0) return;

    addCandidate({
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || `${name.toLowerCase().replace(' ', '.')}@example.com`,
      skills,
      status,
    });

    // Reset form
    setName('');
    setRole('');
    setEmail('');
    setSkills([]);
    setStatus('Applied');
    if (onClose) onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const suggestedRoles = [...new Set(jobs.map(job => job.title))];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Add New Candidate</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., Priya Sharma"
            required
          />
        </div>

        {/* Candidate Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            list="suggestedRoles"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., Frontend Developer"
            required
          />
          <datalist id="suggestedRoles">
            {suggestedRoles.map((suggestedRole) => (
              <option key={suggestedRole} value={suggestedRole} />
            ))}
          </datalist>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., priya@example.com"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Current Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="Applied">Applied</option>
            <option value="Screened">Screened</option>
            <option value="Interview">Interview</option>
            <option value="Hired">Hired</option>
          </select>
        </div>

        {/* Skills Input */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
            Skills *
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., React, TypeScript"
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:text-orange-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Press Enter or click + to add skills. At least one skill is required.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1" disabled={!name.trim() || !role.trim() || skills.length === 0}>
            <User className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react'
import { useScholarships } from '../hooks/useScholarships'
import ScholarshipCard from '../components/ScholarshipCard'
import FilterPanel from '../components/FilterPanel'
import { DEFAULT_FILTERS } from '../utils/filterDefaults'
import type { ScholarshipFilters } from '../types/scholarship'

export default function Browse() {
  const [filters, setFilters] = useState<ScholarshipFilters>(DEFAULT_FILTERS)
  const { scholarships, loading, error, distinctCities, distinctCourses } =
    useScholarships(filters)

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Browse Scholarships</h1>
        <p className="text-gray-400 mt-1">
          Find scholarships that match your profile
        </p>
      </div>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        distinctCities={distinctCities}
        distinctCourses={distinctCourses}
        resultsCount={scholarships.length}
        loading={loading}
      />

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading scholarships...</p>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No scholarships match your filters.
          </p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      )}
    </main>
  )
}

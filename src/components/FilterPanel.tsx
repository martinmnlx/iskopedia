import { useState, useEffect, useRef } from 'react'
import type { ScholarshipFilters } from '../types/scholarship'
import {
  DEFAULT_FILTERS,
  STATUS_OPTIONS,
  SCHOOL_TYPE_OPTIONS,
  YEAR_LEVEL_OPTIONS,
} from '../utils/filterDefaults'

interface FilterPanelProps {
  filters: ScholarshipFilters
  onChange: (filters: ScholarshipFilters) => void
  distinctCities: string[]
  distinctCourses: string[]
  resultsCount: number
  loading: boolean
}

export default function FilterPanel({
  filters,
  onChange,
  distinctCities,
  distinctCourses,
  resultsCount,
  loading,
}: FilterPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external resets (e.g. "Clear all") back into local input
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value })
    }, 300)
  }

  function update<K extends keyof ScholarshipFilters>(
    key: K,
    value: ScholarshipFilters[K],
  ) {
    onChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.city !== 'all' ||
    filters.year_level !== 'all' ||
    filters.course !== 'all' ||
    filters.school_type !== 'all' ||
    filters.min_gwa !== null ||
    filters.max_family_income !== null ||
    filters.tuition_covered !== null ||
    filters.is_renewable !== null

  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      {/* Search bar — always visible */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="sm:hidden shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          Filters{hasActiveFilters && ' \u25CF'}
        </button>
      </div>

      {/* Filter controls — collapsible on mobile */}
      <div className={`mt-4 ${expanded ? 'block' : 'hidden'} sm:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <SelectFilter
            label="Status"
            value={filters.status}
            options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v) => update('status', v as ScholarshipFilters['status'])}
          />

          <SelectFilter
            label="City"
            value={filters.city}
            options={[
              { value: 'all', label: 'All cities' },
              ...distinctCities.map((c) => ({ value: c, label: c })),
            ]}
            onChange={(v) => update('city', v)}
          />

          <SelectFilter
            label="Year Level"
            value={filters.year_level}
            options={YEAR_LEVEL_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v) => update('year_level', v as ScholarshipFilters['year_level'])}
          />

          <SelectFilter
            label="Course"
            value={filters.course}
            options={[
              { value: 'all', label: 'All courses' },
              ...distinctCourses.map((c) => ({ value: c, label: c })),
            ]}
            onChange={(v) => update('course', v)}
          />

          <SelectFilter
            label="School Type"
            value={filters.school_type}
            options={SCHOOL_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v) => update('school_type', v as ScholarshipFilters['school_type'])}
          />

          <NumberFilter
            label="My GWA"
            placeholder="e.g. 1.75"
            value={filters.min_gwa}
            onChange={(v) => update('min_gwa', v)}
            step={0.25}
            min={1.0}
            max={5.0}
          />

          <NumberFilter
            label="Family income (monthly)"
            placeholder="e.g. 30000"
            value={filters.max_family_income}
            onChange={(v) => update('max_family_income', v)}
            step={5000}
            min={0}
          />
        </div>

        {/* Boolean toggles */}
        <div className="flex flex-wrap gap-3 mt-3">
          <ToggleFilter
            label="Tuition covered"
            value={filters.tuition_covered}
            onChange={(v) => update('tuition_covered', v)}
          />
          <ToggleFilter
            label="Renewable"
            value={filters.is_renewable}
            onChange={(v) => update('is_renewable', v)}
          />
        </div>

        {/* Results count + Clear all */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {loading
              ? 'Searching...'
              : `${resultsCount} scholarship${resultsCount !== 1 ? 's' : ''} found`}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function NumberFilter({
  label,
  placeholder,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string
  placeholder: string
  value: number | null
  onChange: (value: number | null) => void
  step?: number
  min?: number
  max?: number
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="number"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value === '' ? null : Number(e.target.value))
        }
        step={step}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function ToggleFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (value: boolean | null) => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (value === null) onChange(true)
        else if (value === true) onChange(false)
        else onChange(null)
      }}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        value === true
          ? 'bg-blue-50 border-blue-300 text-blue-700'
          : value === false
            ? 'bg-gray-100 border-gray-300 text-gray-500 line-through'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
      {value === true && ' \u2713'}
      {value === false && ' \u2717'}
    </button>
  )
}

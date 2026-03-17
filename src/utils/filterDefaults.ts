import type { ScholarshipFilters } from '../types/scholarship'

export const DEFAULT_FILTERS: ScholarshipFilters = {
  search: '',
  status: 'all',
  city: 'all',
  year_level: 'all',
  course: 'all',
  school_type: 'all',
  min_gwa: null,
  max_family_income: null,
  tuition_covered: null,
  is_renewable: null,
}

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' },
] as const

export const SCHOOL_TYPE_OPTIONS = [
  { value: 'all', label: 'All school types' },
  { value: 'suc', label: 'SUC (State College/University)' },
  { value: 'private', label: 'Private' },
  { value: 'both', label: 'Both' },
] as const

export const YEAR_LEVEL_OPTIONS = [
  { value: 'all', label: 'All year levels' },
  { value: 'incoming_freshman', label: 'Incoming Freshman' },
  { value: '2nd_year', label: '2nd Year' },
  { value: '3rd_year', label: '3rd Year' },
  { value: '4th_year', label: '4th Year' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'any', label: 'Any' },
] as const

// ========================
// ENUMS
// ========================

export type SponsorType = 'government' | 'private' | 'ngo' | 'school'
export type SchoolType = 'suc' | 'private' | 'both'
export type ApplicationStatus = 'open' | 'closed' | 'upcoming'
export type YearLevel =
  | 'incoming_freshman'
  | '2nd_year'
  | '3rd_year'
  | '4th_year'
  | 'graduate'
  | 'any'

// ========================
// SPONSOR
// ========================

export interface Sponsor {
  id: string
  name: string
  type: SponsorType
  website?: string
  logo_url?: string
  created_at?: string
}

// ========================
// JUNCTION TABLE ROWS
// (what Supabase returns from joined tables)
// ========================

export interface ScholarshipCity {
  city: string
}

export interface ScholarshipYearLevel {
  year_level: YearLevel
}

export interface ScholarshipCourse {
  course: string
}

// ========================
// SCHOLARSHIP
// (full object with all joined data)
// ========================

export interface Scholarship {
  id: string
  slug: string
  name: string
  description?: string
  image_url?: string

  // Joined from sponsors table
  sponsor: Sponsor

  // Location
  region: string
  school_type: SchoolType

  // Eligibility
  min_gwa?: number
  max_family_income?: number
  citizenship_required: boolean

  // Benefits
  tuition_covered: boolean
  monthly_stipend?: number
  total_estimated_value?: number
  is_renewable: boolean
  renewal_conditions?: string
  allowances?: string[]

  // Application
  status: ApplicationStatus
  deadline?: string
  apply_url?: string
  documents_required?: string[]
  tags?: string[]

  // Metadata
  is_verified: boolean
  is_active: boolean
  created_at?: string
  updated_at?: string

  // Joined from junction tables
  cities: ScholarshipCity[]
  year_levels: ScholarshipYearLevel[]
  courses: ScholarshipCourse[]
}

// ========================
// FILTER STATE
// (for your filter panel component)
// ========================

export interface ScholarshipFilters {
  search: string
  status: ApplicationStatus | 'all'
  city: string | 'all'
  year_level: YearLevel | 'all'
  course: string | 'all'
  school_type: SchoolType | 'all'
  min_gwa: number | null
  max_family_income: number | null
  tuition_covered: boolean | null
  is_renewable: boolean | null
}
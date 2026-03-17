import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import type { Scholarship, ScholarshipFilters } from '../types/scholarship'

interface UseScholarshipsReturn {
  scholarships: Scholarship[]
  loading: boolean
  error: string | null
  distinctCities: string[]
  distinctCourses: string[]
}

export function useScholarships(filters: ScholarshipFilters): UseScholarshipsReturn {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distinctCities, setDistinctCities] = useState<string[]>([])
  const [distinctCourses, setDistinctCourses] = useState<string[]>([])

  // Fetch distinct cities and courses once for dropdown options
  useEffect(() => {
    async function fetchOptions() {
      const [citiesRes, coursesRes] = await Promise.all([
        supabase.from('scholarship_cities').select('city'),
        supabase.from('scholarship_courses').select('course'),
      ])

      if (citiesRes.data) {
        const unique = [...new Set(citiesRes.data.map(r => r.city))].sort()
        setDistinctCities(unique)
      }
      if (coursesRes.data) {
        const unique = [...new Set(coursesRes.data.map(r => r.course))].sort()
        setDistinctCourses(unique)
      }
    }
    fetchOptions()
  }, [])

  // Fetch scholarships whenever filters change
  useEffect(() => {
    let cancelled = false

    async function fetchScholarships() {
      setLoading(true)

      let query = supabase
        .from('scholarships')
        .select(`
          *,
          sponsor:sponsors(*),
          cities:scholarship_cities(city),
          year_levels:scholarship_year_levels(year_level),
          courses:scholarship_courses(course)
        `)
        .eq('is_active', true)

      // Text search
      if (filters.search.trim()) {
        const term = `%${filters.search.trim()}%`
        query = query.or(`name.ilike.${term},description.ilike.${term}`)
      }

      // Enum / equality filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.school_type !== 'all') {
        query = query.eq('school_type', filters.school_type)
      }

      // Numeric range filters
      if (filters.min_gwa !== null) {
        query = query.gte('min_gwa', filters.min_gwa)
      }
      if (filters.max_family_income !== null) {
        query = query.gte('max_family_income', filters.max_family_income)
      }

      // Boolean filters
      if (filters.tuition_covered !== null) {
        query = query.eq('tuition_covered', filters.tuition_covered)
      }
      if (filters.is_renewable !== null) {
        query = query.eq('is_renewable', filters.is_renewable)
      }

      // Junction-table filters
      if (filters.city !== 'all') {
        query = query.eq('cities.city', filters.city)
      }
      if (filters.year_level !== 'all') {
        query = query.eq('year_levels.year_level', filters.year_level)
      }
      if (filters.course !== 'all') {
        query = query.eq('courses.course', filters.course)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (cancelled) return

      if (error) {
        setError(error.message)
        setScholarships([])
      } else {
        setError(null)
        // PostgREST filters junction-table children, not parents.
        // Parents with no matching children still appear with empty arrays.
        let results = data as Scholarship[]

        if (filters.city !== 'all') {
          results = results.filter(s => s.cities.length > 0)
        }
        if (filters.year_level !== 'all') {
          results = results.filter(s => s.year_levels.length > 0)
        }
        if (filters.course !== 'all') {
          results = results.filter(s => s.courses.length > 0)
        }

        setScholarships(results)
      }

      setLoading(false)
    }

    fetchScholarships()

    return () => { cancelled = true }
  }, [
    filters.search,
    filters.status,
    filters.city,
    filters.year_level,
    filters.course,
    filters.school_type,
    filters.min_gwa,
    filters.max_family_income,
    filters.tuition_covered,
    filters.is_renewable,
  ])

  return { scholarships, loading, error, distinctCities, distinctCourses }
}

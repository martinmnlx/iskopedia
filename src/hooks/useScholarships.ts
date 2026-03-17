import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import type { Scholarship } from '../types/scholarship'

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchScholarships() {
      const { data, error } = await supabase
        .from('scholarships')
        .select(`
          *,
          sponsor:sponsors(*),
          cities:scholarship_cities(city),
          year_levels:scholarship_year_levels(year_level),
          courses:scholarship_courses(course)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setScholarships(data)
      }

      setLoading(false)
    }

    fetchScholarships()
  }, [])

  return { scholarships, loading, error }
}
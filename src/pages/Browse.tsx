import { useScholarships } from '../hooks/useScholarships'
import ScholarshipCard from '../components/ScholarshipCard'

export default function Browse() {
  const { scholarships, loading, error } = useScholarships()

  if (loading) return (
    <main className="p-8">
      <p className="text-gray-400">Loading scholarships...</p>
    </main>
  )

  if (error) return (
    <main className="p-8">
      <p className="text-red-500">Error: {error}</p>
    </main>
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Browse Scholarships</h1>
        <p className="text-gray-400 mt-1">{scholarships.length} scholarships found in NCR for Term 2, A.Y. 2025-2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {scholarships.map(s => (
          <ScholarshipCard key={s.id} scholarship={s} />
        ))}
      </div>
    </main>
  )
}
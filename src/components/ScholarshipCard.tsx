import type { Scholarship } from '../types/scholarship'

interface Props {
  scholarship: Scholarship
}

export default function ScholarshipCard({ scholarship }: Props) {
  const { name, description, sponsor, status, deadline,
          tuition_covered, monthly_stipend, total_estimated_value,
          is_renewable, tags } = scholarship

  const deadlineDate = deadline
    ? new Date(deadline).toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : 'Open year-round'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {sponsor?.name}
          </p>
          <h3 className="font-semibold text-gray-800 leading-snug">
            {name}
          </h3>
        </div>
        <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
          status === 'open'
            ? 'bg-green-100 text-green-700'
            : status === 'upcoming'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Benefits */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tuition_covered && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
            Tuition Covered
          </span>
        )}
        {monthly_stipend && (
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
            ₱{monthly_stipend.toLocaleString()}/mo
          </span>
        )}
        {total_estimated_value && (
          <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-md">
            ₱{total_estimated_value.toLocaleString()}/yr
          </span>
        )}
        {is_renewable && (
          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
            Renewable
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Deadline: {deadlineDate}
        </span>
        <a
          href={`/scholarships/${scholarship.slug}`}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          View details →
        </a>
      </div>
    </div>
  )
}
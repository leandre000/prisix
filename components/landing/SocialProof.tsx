import { Star } from 'lucide-react'

export default function SocialProof() {
  const reviews = [
    {
      company: 'Reviewex',
      rating: 4.9,
      logo: 'R',
      colorClasses: 'from-blue-500 to-blue-600',
    },
    {
      company: 'BestApp',
      rating: 4.9,
      logo: 'B',
      colorClasses: 'from-purple-500 to-purple-600',
    },
    {
      company: 'SaasRev',
      rating: 4.9,
      logo: 'S',
      colorClasses: 'from-pink-500 to-pink-600',
    },
  ]

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${review.colorClasses} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{review.logo}</span>
              </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900">{review.rating}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{review.company}</h3>
              <p className="text-gray-600 text-sm">
                "The best learning management platform we've used. Enforced quality and real results."
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


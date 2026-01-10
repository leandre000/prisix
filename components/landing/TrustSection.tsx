export default function TrustSection() {
  const companies = [
    'EDMO',
    'SAMSON',
    'LEXON',
    'SUNROX',
    'MAX',
    'SITOM',
    'TECHED',
    'LEARNPRO',
  ]

  const stats = [
    { value: '20+', label: 'Online Academies', icon: '🏫' },
    { value: '10K+', label: 'Active Students', icon: '👥' },
    { value: '500+', label: 'Expert Trainers', icon: '🎓' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Trusted by companies in 20 online academy
          </h2>
          <p className="text-xl text-gray-600">
            Join leading educational institutions using Umbrella SR
          </p>
        </div>

        {/* Company Logos */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 mb-16">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-xl font-bold text-gray-700">{company}</span>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


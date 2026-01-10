'use client'

import { CheckCircle2, Users, Shield, Target, Clock, TrendingUp } from 'lucide-react'

export default function FeatureShowcase() {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enforcement-Based System',
      description: 'Business rules enforced at database and API levels. No shortcuts, no bypasses.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Dual Confirmation',
      description: 'Both trainer and student must confirm sessions. Prevents fake progress automatically.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personalized Roadmaps',
      description: 'Every student gets a unique learning path. No two roadmaps are the same.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Capacity Management',
      description: 'Trainers declare availability. System prevents overload. Quality guaranteed.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Automatic Payments',
      description: '35% to Wing, 65% to Umbrella. Automatic, immutable, transparent.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Mentor-Controlled',
      description: 'No auto-progression. Only Master Mentors can unlock next phases.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            The best SaaS to create an Academy!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every feature is designed to enforce quality, prevent fraud, and guarantee real outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">JD</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">John Doe</div>
                <div className="text-sm text-gray-600">Master Mentor</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-lg italic">
              "Umbrella SR has transformed how we deliver personalized learning. The enforcement system
              ensures quality at every step, and our students see real results."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


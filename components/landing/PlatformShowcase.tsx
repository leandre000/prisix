'use client'

import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function PlatformShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              An LMS platform that responds to your needs
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Built with enforcement at every layer. Database constraints, API validation, and business
              logic protection ensure quality learning experiences that scale.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Guaranteed trainer-student time',
                'Zero fake progress',
                'Mentor-driven progression',
                'Automatic payment distribution',
                'Complete audit trail',
                'Multi-tenant architecture',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center">
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            {/* Dashboard Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Learning Dashboard</h3>
                    <p className="text-sm text-gray-500">Track your progress</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">4.5h</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600 mb-1">18h</div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Phase 1: Foundations</span>
                      <span className="text-gray-500">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Phase 2: Advanced</span>
                      <span className="text-gray-500">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">✓</div>
                <div className="text-xs font-semibold text-gray-900">Verified</div>
                <div className="text-xs text-gray-500">Dual Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


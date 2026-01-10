import Link from 'next/link'
import { ArrowRight, CheckCircle2, Shield, Users, TrendingUp, Clock, Award, Zap, Target, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Umbrella Academy
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#for-investors" className="text-gray-700 hover:text-blue-600 transition-colors">
                For Investors
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Production-Ready LMS Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Personalized Learning,
              <br />
              Enforced Excellence
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The only LMS that guarantees real trainer-student time, prevents fake progress,
              and protects learning integrity at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#for-investors"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all"
              >
                Investor Information
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Guaranteed Learning Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Fake Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.5+</div>
              <div className="text-gray-600">Hours/Week Minimum</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-gray-600">Scalable Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Built for Real Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every feature is designed to enforce quality, prevent fraud, and guarantee real outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Enforcement-Based System"
              description="Business rules enforced at database and API levels. No shortcuts, no bypasses."
              color="blue"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Dual Confirmation"
              description="Both trainer and student must confirm sessions. Prevents fake progress automatically."
              color="purple"
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8" />}
              title="Mentor-Controlled Progression"
              description="No auto-progression. Only Master Mentors can unlock next phases. Human judgment preserved."
              color="blue"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Capacity Management"
              description="Trainers declare availability. System prevents overload. Quality guaranteed."
              color="purple"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Personalized Roadmaps"
              description="Every student gets a unique learning path. No two roadmaps are the same."
              color="blue"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Automatic Payment Distribution"
              description="35% to Wing, 65% to Umbrella. Automatic, immutable, transparent."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A controlled, step-by-step process that ensures quality at every stage.
            </p>
          </div>

          <div className="space-y-8">
            <StepCard
              number={1}
              title="Choose Your Wing"
              description="Select from independent schools under the Umbrella. Each wing has its own culture and focus."
            />
            <StepCard
              number={2}
              title="Read Guidance Document"
              description="Understand the wing's approach, expectations, and learning philosophy before proceeding."
            />
            <StepCard
              number={3}
              title="Design Your Roadmap"
              description="Work with a trainer to create a completely personalized learning roadmap. No templates, no shortcuts."
            />
            <StepCard
              number={4}
              title="Mentor Approval"
              description="Master Mentor reviews and approves your roadmap. Learning cannot start without approval."
            />
            <StepCard
              number={5}
              title="Payment & Access"
              description="Monthly payment unlocks learning access. No payment, no sessions. Simple and fair."
            />
            <StepCard
              number={6}
              title="Guaranteed Learning Time"
              description="Minimum 4.5 hours per week of real trainer-student time. Dual confirmation ensures authenticity."
            />
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section id="for-investors" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Built for Scale & Revenue
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Production-ready architecture designed to generate revenue and scale globally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Technical Excellence</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Multi-Tenant Architecture</div>
                    <div className="text-gray-600">Independent Wings scale independently under one umbrella</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Enforcement at Every Layer</div>
                    <div className="text-gray-600">Database constraints, API validation, business logic protection</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Complete Audit Trail</div>
                    <div className="text-gray-600">Every action logged for compliance and dispute resolution</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Automatic Payment Processing</div>
                    <div className="text-gray-600">Seamless wallet distribution, no manual intervention needed</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Business Model</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Monthly Recurring Revenue</div>
                    <div className="text-gray-600">Predictable income from student subscriptions</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Multi-Wing Expansion</div>
                    <div className="text-gray-600">Each new wing multiplies revenue potential</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Quality Guarantee</div>
                    <div className="text-gray-600">Enforcement prevents fraud, protects brand reputation</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Global Scalability</div>
                    <div className="text-gray-600">Architecture supports worldwide expansion</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join students, trainers, and investors building the future of personalized education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Your Journey
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Umbrella Academy</span>
              </div>
              <p className="text-sm">
                Production-ready LMS with enforcement-based learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Umbrella Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'purple'
}) {
  const colorClasses = color === 'blue'
    ? 'bg-blue-100 text-blue-600'
    : 'bg-purple-100 text-purple-600'

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-16 h-16 ${colorClasses} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start space-x-6 bg-white p-6 rounded-xl shadow-lg">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}


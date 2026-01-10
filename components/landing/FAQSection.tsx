'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How can I use Umbrella SR?',
      answer:
        'Umbrella SR is a complete learning management system. Students choose a Wing, read guidance documents, create personalized roadmaps with trainers, get mentor approval, make payments, and start learning with guaranteed trainer-student time.',
    },
    {
      question: 'When should I use a roadmap?',
      answer:
        'Every student must create a personalized roadmap before starting their learning journey. The roadmap is designed collaboratively with a trainer and must be approved by a Master Mentor. This ensures quality and personalized learning paths.',
    },
    {
      question: 'How does dual confirmation work?',
      answer:
        'Both the trainer and student must confirm each learning session. This prevents fake progress and ensures real learning time. Sessions without dual confirmation are flagged for review.',
    },
    {
      question: 'What is the payment structure?',
      answer:
        'Payments are monthly and automatically distributed: 35% to the Wing and 65% to Umbrella. Trainers earn based on confirmed sessions and can withdraw from their wallet anytime.',
    },
    {
      question: 'Can I progress automatically?',
      answer:
        'No. Progression is mentor-controlled. Only Master Mentors can approve movement to the next phase, ensuring quality and preventing rushed learning.',
    },
    {
      question: 'How do I become a trainer?',
      answer:
        'Trainers must be assigned to a Wing and declare their capacity. The system prevents overloading trainers to maintain quality. Contact a Wing Administrator to get started.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Umbrella SR
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


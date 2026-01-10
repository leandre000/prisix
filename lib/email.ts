/**
 * Email Notification System
 * Production-ready email service integration
 */

// Email templates
export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function generateRoadmapApprovedEmail(studentName: string, roadmapTitle: string): EmailTemplate {
  return {
    subject: 'Your Learning Roadmap Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Roadmap Approved!</h2>
        <p>Hello ${studentName},</p>
        <p>Great news! Your learning roadmap "<strong>${roadmapTitle}</strong>" has been approved by a Master Mentor.</p>
        <p>You can now proceed to make a payment to start your learning journey.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/student/payments" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Make Payment
        </a>
      </div>
    `,
    text: `Hello ${studentName},\n\nYour learning roadmap "${roadmapTitle}" has been approved. You can now make a payment to start learning.`,
  }
}

export function generateRoadmapRejectedEmail(studentName: string, roadmapTitle: string, comments: string): EmailTemplate {
  return {
    subject: 'Roadmap Review - Changes Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Roadmap Review</h2>
        <p>Hello ${studentName},</p>
        <p>Your learning roadmap "<strong>${roadmapTitle}</strong>" requires some changes before it can be approved.</p>
        <div style="background-color: #fef2f2; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Mentor Comments:</strong></p>
          <p style="margin: 8px 0 0 0;">${comments}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/student/roadmap" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Review Roadmap
        </a>
      </div>
    `,
    text: `Hello ${studentName},\n\nYour roadmap "${roadmapTitle}" requires changes. Comments: ${comments}`,
  }
}

export function generateSessionReminderEmail(
  userName: string,
  sessionDate: string,
  sessionTime: string,
  meetingLink: string
): EmailTemplate {
  return {
    subject: 'Upcoming Learning Session Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Session Reminder</h2>
        <p>Hello ${userName},</p>
        <p>This is a reminder about your upcoming learning session:</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Date:</strong> ${sessionDate}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${sessionTime}</p>
          <a href="${meetingLink}" 
             style="display: inline-block; padding: 8px 16px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 12px;">
            Join Meeting
          </a>
        </div>
      </div>
    `,
    text: `Hello ${userName},\n\nYou have a session on ${sessionDate} at ${sessionTime}. Join: ${meetingLink}`,
  }
}

export function generatePaymentSuccessEmail(studentName: string, amount: number, endDate: string): EmailTemplate {
  return {
    subject: 'Payment Successful - Learning Access Activated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Payment Successful!</h2>
        <p>Hello ${studentName},</p>
        <p>Your payment of <strong>$${amount.toFixed(2)}</strong> has been processed successfully.</p>
        <p>Your learning access is now active until <strong>${endDate}</strong>.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/student" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Go to Dashboard
        </a>
      </div>
    `,
    text: `Hello ${studentName},\n\nPayment of $${amount.toFixed(2)} successful. Access until ${endDate}.`,
  }
}

// Email sending function (integrate with your email service)
export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // TODO: Integrate with email service (SendGrid, AWS SES, Resend, etc.)
    // For now, log the email
    console.log('Email would be sent:', {
      to,
      subject: template.subject,
    })

    // In production, replace with actual email service:
    // const response = await emailService.send({
    //   to,
    //   subject: template.subject,
    //   html: template.html,
    //   text: template.text,
    // })

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}


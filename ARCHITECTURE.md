# Umbrella SR - System Architecture

## Overview

Umbrella SR is a production-ready, enforcement-based Learning Management System designed to guarantee real trainer-student learning time and prevent fake progress.

## System Design Principles

1. **Enforcement-First**: Business rules enforced at database and API levels
2. **Human-Controlled**: System enforces rules but never makes decisions
3. **Multi-Tenant**: Umbrella → Wings → Users hierarchy
4. **Audit-Ready**: Complete activity logging for compliance
5. **Scalable**: Architecture supports global expansion

## Technology Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Server Components** - Optimized rendering

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Type-safe server mutations
- **PostgreSQL** - Primary database
- **Prisma ORM** - Type-safe database access
- **NextAuth.js** - Authentication & session management

### Infrastructure
- **Vercel** - Hosting & deployment
- **MinIO/S3** - Object storage for documents
- **Stripe/Payment Gateway** - Payment processing

## Database Schema

### Core Entities

1. **User** - Base user entity with role-based profiles
2. **Wing** - Independent school under Umbrella
3. **Roadmap** - Personalized learning path (unique per student)
4. **Session** - Live learning sessions with dual confirmation
5. **Payment** - Monthly subscription payments
6. **Wallet** - Trainer, Wing, and Umbrella wallets
7. **Transaction** - All financial transactions
8. **ActivityLog** - Complete audit trail

### Key Relationships

- User → Role-specific Profile (1:1)
- Student → Roadmap (1:1)
- Roadmap → Trainer (N:1)
- Roadmap → Mentor Approvals (1:N)
- Session → Trainer + Student (N:1 each)
- Payment → Automatic Wallet Distribution

## Business Rules Enforcement

### Entry Flow Enforcement
- Wing selection required
- Guidance document must be read
- Trainer meeting required
- Roadmap approval mandatory
- Payment required for access

### Capacity Management
- Trainers declare weekly hours
- System calculates max students: `(weeklyHours * 0.9) / 4.5`
- Database constraints prevent over-assignment
- API validation enforces limits

### Session Confirmation
- Both trainer and student must confirm
- Unconfirmed sessions don't count toward hours
- Disputed sessions pause trainer earnings
- Admin review required for disputes

### Payment Distribution
- Automatic split: 35% Wing, 65% Umbrella
- Immutable at database level
- Atomic transactions ensure consistency

### Progression Control
- Roadmaps locked by default
- Only mentor approval unlocks phases
- No auto-progression
- Human judgment preserved

## API Architecture

### Authentication
- JWT-based sessions via NextAuth
- Role-based route protection via middleware
- Server-side RBAC enforcement

### Endpoints Structure
```
/api/auth/*          - Authentication
/api/wings/*         - Wing management
/api/roadmaps/*      - Roadmap CRUD & approval
/api/sessions/*      - Session management
/api/payments/*      - Payment processing
/api/wallets/*       - Wallet operations
/api/admin/*         - Administrative functions
```

### Error Handling
- Consistent error responses
- Detailed logging
- User-friendly messages
- Security-conscious error details

## Security

### Authentication & Authorization
- Password hashing with bcrypt
- JWT token-based sessions
- Role-based access control (RBAC)
- Route-level protection via middleware

### Data Protection
- Server-side validation only
- No trust in frontend
- SQL injection prevention via Prisma
- XSS protection via React

### Audit & Compliance
- Complete activity logging
- Immutable transaction records
- Dispute resolution support
- Regulatory compliance ready

## Scalability Considerations

### Database
- Indexed queries for performance
- Normalized schema for consistency
- Connection pooling
- Read replicas for scaling

### Application
- Serverless architecture (Vercel)
- Stateless API design
- Caching strategy for dashboards
- Queue system for async tasks

### Multi-Tenancy
- Logical data isolation by Wing
- Umbrella-level global access
- Wing-specific resource limits
- Independent scaling per Wing

## Deployment

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Session encryption
- `NEXTAUTH_URL` - Application URL
- `MINIO_*` - Object storage config
- `STRIPE_*` - Payment gateway config

### Database Migrations
```bash
npm run db:migrate  # Run migrations
npm run db:push     # Push schema changes
npm run db:studio   # Open Prisma Studio
```

### Build & Deploy
```bash
npm run build       # Production build
npm start          # Start production server
```

## Monitoring & Observability

### Logging
- Activity logs for all critical actions
- Error logging with stack traces
- Payment transaction logs
- Session confirmation logs

### Metrics (Future)
- User engagement metrics
- Payment success rates
- Session completion rates
- Trainer capacity utilization

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live session updates
   - Push notifications
   - Real-time chat

2. **Analytics Dashboard**
   - Learning progress visualization
   - Revenue analytics
   - Capacity utilization reports

3. **Mobile App**
   - React Native application
   - Offline support
   - Push notifications

4. **Advanced Features**
   - Video recording of sessions
   - Automated attendance tracking
   - AI-powered progress insights (non-decision making)


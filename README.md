# Bank Referral System

A digital banking referral system that allows customers to refer friends and family members to earn rewards.

## Features

- Customer registration and authentication
- Referral code generation and tracking
- Reward calculation and distribution
- Dashboard for referral analytics
- Admin panel for system management

## Tech Stack

- Backend: Node.js/Express or Python/Django
- Database: PostgreSQL/MySQL
- Frontend: React/Vue.js
- Authentication: JWT

## Installation

```bash
# Clone repository
git clone <repository-url>
cd bank-referral-system

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Setup database with Prisma
npx prisma migrate dev
npx prisma generate

# Run application
npm start
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/referrals` - Get user referrals
- `POST /api/referrals` - Create referral
- `GET /api/rewards` - Get user rewards

## License

MIT License
# Clothing Shop

A modern e-commerce platform for clothing built with Next.js and Supabase.

## Features

- User authentication (Sign up, Login, Logout)
- Email OTP verification for signup
- Product browsing and search
- Shopping cart functionality
- User profile management

## Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Supabase account

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

1. Create a new table in your Supabase database by running the SQL migration in `supabase/migrations/20240913180000_create_otp_verifications_table.sql`
2. Make sure to enable email authentication in your Supabase project settings

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## OTP Verification Flow

1. User enters email and clicks "Send OTP"
2. System generates a 6-digit OTP and stores it in the database
3. User receives the OTP via email (in development, check the console for the OTP)
4. User enters the OTP and completes the signup process
5. System verifies the OTP and creates the user account

## Production Deployment

For production deployment, make sure to:

1. Set up a proper email service for sending OTPs
2. Configure environment variables in your hosting platform
3. Set up proper CORS policies
4. Enable SSL for secure connections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
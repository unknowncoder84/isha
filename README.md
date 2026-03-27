# Diabetes Management System 🏥

A comprehensive diabetes management platform with AI-powered health monitoring, patient portal, and doctor dashboard.

## 🌟 Features

### Patient Portal
- **AI Health Consultant**: Diabetes-specific chatbot that provides personalized advice
- **Medical Report Upload**: Upload and analyze medical reports
- **Real-time Glucose Monitoring**: Track glucose levels, BMI, heart rate, and blood pressure
- **Appointments**: Schedule and manage appointments with doctors
- **Alerts System**: Get notified about critical health events
- **Consultations History**: View past consultations and recommendations

### Doctor Portal
- **Patient Management**: Add, view, edit, and delete patient records
- **Real-time Dashboard**: Live updates on patients, appointments, and alerts
- **Appointment Scheduling**: Manage patient appointments
- **Consultations**: Track and manage patient consultations
- **Critical Alerts**: Monitor high-priority patient alerts
- **Search & Filter**: Quickly find patients by name or ID

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 20.x or higher
- Python 3.8 or higher
- Supabase account
- Git

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/unknowncoder84/isha.git
cd isha
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Environment Setup

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 5. Database Setup

Run the SQL schema in your Supabase SQL Editor:
- Open `SUPABASE_SETUP_IMPROVED.sql`
- Copy and execute in Supabase dashboard

## 🏃 Running Locally

### Start Both Frontend & Backend
```bash
npm run dev:all
```

Or run separately:

### Frontend Only
```bash
npm run dev
```
Access at: http://localhost:3030

### Backend Only
```bash
npm run backend
```
Access at: http://localhost:8000

## 👥 Default Credentials

### Doctor Portal
- **URL**: `/doctor/login`
- **Username**: `admin`
- **Password**: `admin123`

### Patient Portal
- **URL**: `/auth/signup` or `/auth/login`
- Create account with email/password

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Patient dashboard
│   └── doctor/            # Doctor portal
├── backend/               # FastAPI backend
│   ├── main.py           # API endpoints
│   └── routes/           # API routes
├── components/           # React components
│   └── ui/              # UI components
├── lib/                 # Utilities
│   ├── supabase.ts     # Supabase client
│   ├── app-context.tsx # Global state
│   └── ai-consultant.ts # AI chatbot
└── demo-files/         # Sample patient data

```

## 🌐 Deployment to Netlify

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/unknowncoder84/isha.git
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `isha` repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy site"

### Step 3: Update Supabase Redirect URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL to:
   - Site URL: `https://your-site.netlify.app`
   - Redirect URLs: `https://your-site.netlify.app/**`

## 🔒 Security Notes

- Never commit `.env.local` or `backend/.env` files
- Keep your Supabase service role key secure
- Enable Row Level Security (RLS) in Supabase
- Disable email confirmation in Supabase for easier testing

## 📚 Documentation

- `DEPLOY_CHECKLIST.md` - Deployment checklist
- `DOCTOR_PORTAL_GUIDE.md` - Doctor portal features
- `EMAIL_AUTH_COMPLETE.md` - Authentication setup
- `SUPABASE_SETUP_IMPROVED.sql` - Database schema

## 🐛 Troubleshooting

### Signup Error
If you get "Database error saving new user":
1. Go to Supabase → Authentication → Providers → Email
2. Disable "Confirm email"
3. Try signing up again

### Real-time Not Working
1. Check Supabase Realtime is enabled
2. Verify RLS policies allow subscriptions
3. Check browser console for errors

## 📝 License

MIT License

## 👨‍💻 Author

Created with ❤️ for diabetes management

---

**Live Demo**: Coming soon on Netlify!

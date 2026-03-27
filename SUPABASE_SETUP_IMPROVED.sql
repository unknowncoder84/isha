-- ============================================
-- DIABETES MANAGEMENT SYSTEM - COMPLETE SETUP
-- ============================================
-- Run this script in your Supabase SQL Editor
-- This will create all tables with proper relationships and security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. PROFILES TABLE (User Information)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('Patient', 'Doctor', 'Admin')) DEFAULT 'Patient',
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PATIENT RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.patient_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
    last_scan_date DATE NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')) NOT NULL,
    glucose_level DECIMAL(5,2),
    bmi DECIMAL(4,2),
    blood_pressure TEXT,
    added_by TEXT NOT NULL,
    added_date DATE DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. HEALTH RECORDS TABLE (Detailed Metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    glucose DECIMAL(5,2) NOT NULL,
    bmi DECIMAL(4,2),
    heart_rate INTEGER,
    blood_pressure TEXT,
    systolic INTEGER,
    diastolic INTEGER,
    risk_level TEXT CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
    confidence DECIMAL(4,3),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    type TEXT CHECK (type IN ('checkup', 'followup', 'emergency', 'consultation')) DEFAULT 'checkup',
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CONSULTATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    risk_level TEXT CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
    status TEXT CHECK (status IN ('completed', 'pending', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('spike', 'hypo', 'normal', 'warning', 'info')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. MEDICAL DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.medical_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    extracted_data JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. CHAT MESSAGES TABLE (AI Consultant)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_patient_records_user_id ON public.patient_records(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_records_patient_id ON public.patient_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_records_risk_level ON public.patient_records(risk_level);

CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON public.health_records(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON public.consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON public.alerts(read);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_medical_documents_user_id ON public.medical_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS POLICIES - PATIENT RECORDS
-- ============================================
DROP POLICY IF EXISTS "Users can view own patient records" ON public.patient_records;
CREATE POLICY "Users can view own patient records" ON public.patient_records
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own patient records" ON public.patient_records;
CREATE POLICY "Users can insert own patient records" ON public.patient_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own patient records" ON public.patient_records;
CREATE POLICY "Users can update own patient records" ON public.patient_records
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own patient records" ON public.patient_records;
CREATE POLICY "Users can delete own patient records" ON public.patient_records
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - HEALTH RECORDS
-- ============================================
DROP POLICY IF EXISTS "Users can view own health records" ON public.health_records;
CREATE POLICY "Users can view own health records" ON public.health_records
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own health records" ON public.health_records;
CREATE POLICY "Users can insert own health records" ON public.health_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - APPOINTMENTS
-- ============================================
DROP POLICY IF EXISTS "Users can view related appointments" ON public.appointments;
CREATE POLICY "Users can view related appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Users can insert appointments" ON public.appointments;
CREATE POLICY "Users can insert appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Users can update related appointments" ON public.appointments;
CREATE POLICY "Users can update related appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;
CREATE POLICY "Users can delete own appointments" ON public.appointments
    FOR DELETE USING (auth.uid() = patient_id);

-- ============================================
-- RLS POLICIES - CONSULTATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view related consultations" ON public.consultations;
CREATE POLICY "Users can view related consultations" ON public.consultations
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Users can insert consultations" ON public.consultations;
CREATE POLICY "Users can insert consultations" ON public.consultations
    FOR INSERT WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Users can update related consultations" ON public.consultations;
CREATE POLICY "Users can update related consultations" ON public.consultations
    FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- ============================================
-- RLS POLICIES - ALERTS
-- ============================================
DROP POLICY IF EXISTS "Users can view own alerts" ON public.alerts;
CREATE POLICY "Users can view own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own alerts" ON public.alerts;
CREATE POLICY "Users can update own alerts" ON public.alerts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own alerts" ON public.alerts;
CREATE POLICY "Users can insert own alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - MEDICAL DOCUMENTS
-- ============================================
DROP POLICY IF EXISTS "Users can view own documents" ON public.medical_documents;
CREATE POLICY "Users can view own documents" ON public.medical_documents
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON public.medical_documents;
CREATE POLICY "Users can insert own documents" ON public.medical_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.medical_documents;
CREATE POLICY "Users can delete own documents" ON public.medical_documents
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - CHAT MESSAGES
-- ============================================
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.chat_messages;
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_records_updated_at ON public.patient_records;
CREATE TRIGGER update_patient_records_updated_at 
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'Patient')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.patient_records IS 'Patient medical records and scan results';
COMMENT ON TABLE public.health_records IS 'Detailed health metrics and measurements';
COMMENT ON TABLE public.appointments IS 'Doctor appointments scheduling';
COMMENT ON TABLE public.consultations IS 'Medical consultations history';
COMMENT ON TABLE public.alerts IS 'Health alerts and notifications';
COMMENT ON TABLE public.medical_documents IS 'Uploaded medical documents and reports';
COMMENT ON TABLE public.chat_messages IS 'AI consultant chat history';

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Your database is now ready!
-- Next steps:
-- 1. Create test users via Supabase Auth
-- 2. Test the application
-- 3. Monitor RLS policies in production


-- ============================================
-- 9. DOCTOR USERS TABLE (In-house Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS public.doctor_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'doctor', 'staff')) DEFAULT 'doctor',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.doctor_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for doctor users
CREATE INDEX IF NOT EXISTS idx_doctor_users_username ON public.doctor_users(username);
CREATE INDEX IF NOT EXISTS idx_doctor_users_email ON public.doctor_users(email);
CREATE INDEX IF NOT EXISTS idx_doctor_users_is_active ON public.doctor_users(is_active);

-- Enable RLS for doctor_users
ALTER TABLE public.doctor_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_users (only admins can manage)
DROP POLICY IF EXISTS "Admins can view all doctor users" ON public.doctor_users;
CREATE POLICY "Admins can view all doctor users" ON public.doctor_users
    FOR SELECT USING (true); -- In production, add proper admin check

DROP POLICY IF EXISTS "Admins can insert doctor users" ON public.doctor_users;
CREATE POLICY "Admins can insert doctor users" ON public.doctor_users
    FOR INSERT WITH CHECK (true); -- In production, add proper admin check

DROP POLICY IF EXISTS "Admins can update doctor users" ON public.doctor_users;
CREATE POLICY "Admins can update doctor users" ON public.doctor_users
    FOR UPDATE USING (true); -- In production, add proper admin check

-- Trigger for doctor_users updated_at
DROP TRIGGER IF EXISTS update_doctor_users_updated_at ON public.doctor_users;
CREATE TRIGGER update_doctor_users_updated_at 
    BEFORE UPDATE ON public.doctor_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (username: admin, password: admin123)
-- Password is hashed using bcrypt - you should change this in production!
INSERT INTO public.doctor_users (username, password_hash, full_name, email, role)
VALUES (
    'admin',
    '$2a$10$rKZLvXZvXZvXZvXZvXZvXeO8YqKqKqKqKqKqKqKqKqKqKqKqKqKqK', -- This is a placeholder, use proper bcrypt hash
    'Dr. Administrator',
    'admin@hospital.com',
    'admin'
)
ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE public.doctor_users IS 'In-house authentication for doctor portal';

-- ============================================
-- DOCTOR PORTAL SETUP COMPLETE
-- ============================================

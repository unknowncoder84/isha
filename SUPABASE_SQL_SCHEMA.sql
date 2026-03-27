-- Diabetes Management System - Supabase SQL Schema
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    role TEXT CHECK (role IN ('Patient', 'Doctor', 'Admin')) DEFAULT 'Patient',
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Records table
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Sensor Readings table (for continuous glucose monitoring)
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    glucose DECIMAL(5,2) NOT NULL,
    heart_rate INTEGER,
    temperature DECIMAL(4,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    type TEXT CHECK (type IN ('checkup', 'followup', 'emergency', 'consultation')) DEFAULT 'checkup',
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    consultation_date DATE NOT NULL,
    notes TEXT,
    risk_level TEXT CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
    status TEXT CHECK (status IN ('completed', 'pending', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('spike', 'hypo', 'normal', 'warning')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Documents table (for uploaded PDFs)
CREATE TABLE IF NOT EXISTS public.medical_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    extracted_data JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages table (AI Consultant history)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON public.health_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_user_id ON public.sensor_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON public.sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON public.alerts(read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for health_records
CREATE POLICY "Users can view own health records" ON public.health_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records" ON public.health_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for sensor_readings
CREATE POLICY "Users can view own sensor readings" ON public.sensor_readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor readings" ON public.sensor_readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can insert own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- RLS Policies for consultations
CREATE POLICY "Users can view own consultations" ON public.consultations
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for medical_documents
CREATE POLICY "Users can view own documents" ON public.medical_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.medical_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo doctor account
-- Password: doctor01 (you'll need to create this user in Supabase Auth first)
-- Then run this to set the profile:
-- INSERT INTO public.profiles (id, full_name, role, phone, gender)
-- VALUES (
--     'YOUR_USER_ID_FROM_AUTH',
--     'Dr. Priya Sharma',
--     'Doctor',
--     '+91-9876543210',
--     'Female'
-- );

-- Insert demo data (optional)
-- You can uncomment and modify these after creating users

-- INSERT INTO public.health_records (user_id, glucose, bmi, heart_rate, blood_pressure, systolic, diastolic, risk_level, confidence)
-- VALUES 
--     ('patient_user_id', 128.0, 26.8, 78, '132/84', 132, 84, 'Prediabetic', 0.892),
--     ('patient_user_id', 156.0, 29.2, 82, '138/88', 138, 88, 'Diabetic', 0.945);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.health_records IS 'Health records and glucose measurements';
COMMENT ON TABLE public.sensor_readings IS 'Continuous glucose monitoring data';
COMMENT ON TABLE public.appointments IS 'Doctor appointments';
COMMENT ON TABLE public.consultations IS 'Medical consultations history';
COMMENT ON TABLE public.alerts IS 'Health alerts and notifications';
COMMENT ON TABLE public.medical_documents IS 'Uploaded medical documents and reports';
COMMENT ON TABLE public.chat_messages IS 'AI consultant chat history';

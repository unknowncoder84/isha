-- ============================================
-- GlucoVision Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Patient', 'Doctor', 'Admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PATIENT RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patient_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  patient_id TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  last_scan_date DATE NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
  added_by TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCAN RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_record_id UUID REFERENCES patient_records(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
  confidence DECIMAL(3,2) NOT NULL,
  glucose_avg INTEGER NOT NULL,
  bmi_value DECIMAL(4,1) NOT NULL,
  heart_rate INTEGER NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GLUCOSE READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS glucose_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_result_id UUID REFERENCES scan_results(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  glucose INTEGER NOT NULL,
  bmi DECIMAL(4,1),
  heart_rate INTEGER,
  systolic INTEGER,
  diastolic INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Normal', 'Prediabetic', 'Diabetic')),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checkup', 'followup', 'emergency', 'consultation')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('spike', 'hypo', 'normal', 'warning')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patient_records_patient_id ON patient_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_records_user_id ON patient_records(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_patient_record_id ON scan_results(patient_record_id);
CREATE INDEX IF NOT EXISTS idx_glucose_readings_scan_result_id ON glucose_readings(scan_result_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE glucose_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Patient records policies
CREATE POLICY "Doctors can view all patient records" ON patient_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('Doctor', 'Admin')
    )
  );

CREATE POLICY "Patients can view their own records" ON patient_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert patient records" ON patient_records
  FOR INSERT WITH CHECK (true);

-- Scan results policies
CREATE POLICY "Users can view scan results for their patients" ON scan_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_records 
      WHERE patient_records.id = scan_results.patient_record_id
      AND (
        patient_records.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('Doctor', 'Admin')
        )
      )
    )
  );

-- Consultations policies
CREATE POLICY "Doctors can view all consultations" ON consultations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('Doctor', 'Admin')
    )
  );

CREATE POLICY "Patients can view their own consultations" ON consultations
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Doctors can create consultations" ON consultations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('Doctor', 'Admin')
    )
  );

-- Appointments policies
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (
    patient_id = auth.uid() 
    OR doctor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their appointments" ON appointments
  FOR UPDATE USING (
    patient_id = auth.uid() 
    OR doctor_id = auth.uid()
  );

-- Alerts policies
CREATE POLICY "Users can view their own alerts" ON alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own alerts" ON alerts
  FOR UPDATE USING (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own messages" ON chat_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- DEMO DATA
-- ============================================

-- Insert demo users (passwords are hashed 'demo123')
INSERT INTO users (id, email, name, password_hash, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'priya@example.com', 'Priya Singh', '$2a$10$demo123hashedpassword', 'Patient'),
  ('22222222-2222-2222-2222-222222222222', 'rajesh@example.com', 'Rajesh Kumar', '$2a$10$demo123hashedpassword', 'Patient'),
  ('33333333-3333-3333-3333-333333333333', 'arjun@example.com', 'Arjun Mehta', '$2a$10$demo123hashedpassword', 'Patient'),
  ('44444444-4444-4444-4444-444444444444', 'doctor1@hospital.com', 'Dr. Priya Sharma', '$2a$10$doctor01hashedpassword', 'Doctor')
ON CONFLICT (email) DO NOTHING;

-- Insert demo consultations
INSERT INTO consultations (patient_name, doctor_name, date, notes, status, risk_level, patient_id, doctor_id) VALUES
  ('Demo User', 'Dr. Priya Sharma', 'Feb 28, 2026', 'Initial diabetes screening - Prediabetic range detected', 'completed', 'Prediabetic', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
  ('Alice Johnson', 'Dr. Priya Sharma', 'Feb 25, 2026', 'Routine check-up - All parameters normal', 'completed', 'Normal', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
  ('Bob Martinez', 'Dr. Priya Sharma', 'Feb 22, 2026', 'Follow-up for diabetes management - Medication adjustment needed', 'completed', 'Diabetic', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- Insert demo appointments
INSERT INTO appointments (patient_name, doctor_name, date, time, type, status, notes, patient_id, doctor_id) VALUES
  ('Demo User', 'Dr. Priya Sharma', '2026-03-15', '10:00 AM', 'followup', 'scheduled', 'Follow-up for prediabetic management', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
  ('Alice Johnson', 'Dr. Priya Sharma', '2026-03-20', '2:30 PM', 'checkup', 'scheduled', 'Annual health check-up', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
  ('Bob Martinez', 'Dr. Priya Sharma', '2026-03-10', '11:00 AM', 'consultation', 'scheduled', 'Diabetes medication review', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at BEFORE UPDATE ON patient_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETED
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- All tables, indexes, policies, and demo data will be created

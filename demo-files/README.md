# Demo Medical Reports

This folder contains 3 demo medical reports that you can upload to test the AI scanning and analysis features.

## Demo Accounts & Reports

### 1. Patient: Priya Singh (Normal/Healthy)
**File:** `patient2-priya-singh-report.txt`

**Login Credentials:**
- Email: `priya@example.com`
- Password: `demo123`
- Role: Patient

**Health Status:**
- Risk Level: **NORMAL** ✓
- Fasting Glucose: 92 mg/dL (Normal)
- HbA1c: 5.3% (Excellent)
- BMI: 22.1 (Normal Weight)
- Blood Pressure: 118/76 (Normal)
- Overall: Excellent health with optimal metabolic markers

**Key Features:**
- All parameters within normal range
- Active lifestyle with regular exercise
- Balanced diet and good nutrition
- No medications required
- Preventive care focus

---

### 2. Patient: Rajesh Kumar (Prediabetic)
**File:** `patient1-rajesh-kumar-report.txt`

**Login Credentials:**
- Email: `rajesh@example.com`
- Password: `demo123`
- Role: Patient

**Health Status:**
- Risk Level: **PREDIABETIC** ⚠
- Fasting Glucose: 128 mg/dL (Elevated)
- HbA1c: 6.2% (Prediabetic Range)
- BMI: 25.3 (Overweight)
- Blood Pressure: 132/86 (Stage 1 Hypertension)
- Overall: Moderate risk, lifestyle modifications needed

**Key Features:**
- Glucose levels in prediabetic range
- Overweight with metabolic syndrome indicators
- Family history of diabetes
- Requires lifestyle changes
- No medication yet, monitoring required

---

### 3. Patient: Arjun Mehta (Diabetic - High Risk)
**File:** `patient3-arjun-mehta-report.txt`

**Login Credentials:**
- Email: `arjun@example.com`
- Password: `demo123`
- Role: Patient

**Health Status:**
- Risk Level: **DIABETIC** ⚠⚠
- Fasting Glucose: 168 mg/dL (High)
- HbA1c: 8.7% (Poor Control)
- BMI: 31.2 (Obese Class I)
- Blood Pressure: 148/94 (Stage 2 Hypertension)
- Overall: High risk with early complications

**Key Features:**
- Type 2 Diabetes with poor control
- Multiple complications detected
- Requires immediate medical intervention
- Multiple medications prescribed
- Intensive monitoring needed

---

## Doctor Account

**Login Credentials:**
- Email: `doctor1`
- Password: `doctor01`
- Role: Doctor
- Name: Dr. Priya Sharma

**Access:**
- View all patient consultations
- Create consultation logs
- Manage appointments
- Access patient dashboard overview
- No upload/scan features (doctor-specific view)

---

## How to Use These Reports

### Step 1: Login
1. Go to http://localhost:4008
2. Click "Log In"
3. Use one of the credentials above
4. Or create a new account with "Get Started"

### Step 2: Upload Report
1. Navigate to "Upload & Scan" (for patients)
2. Click "Choose File" or drag and drop
3. Select one of the demo report files
4. Click "Scan Report"

### Step 3: View Results
1. AI will analyze the report (simulated processing)
2. View risk assessment and health metrics
3. Check the dashboard for graphs and trends
4. Explore AI consultant for recommendations

### Step 4: Explore Features
- **Dashboard**: View comprehensive health metrics with charts
- **AI Consultant**: Chat with AI for health advice
- **Appointments**: Schedule and manage appointments
- **Alerts**: View health notifications
- **Profile**: Update personal information

---

## Report Details

### What Each Report Contains:

1. **Patient Information**
   - Name, ID, Age, Gender, Contact
   - Report Date, Physician

2. **Glucose Metabolism Panel**
   - Fasting Blood Glucose
   - Postprandial Glucose
   - HbA1c (3-month average)
   - Oral Glucose Tolerance Test

3. **Metabolic Parameters**
   - BMI (Body Mass Index)
   - Waist Circumference
   - Lipid Profile (Cholesterol, Triglycerides)

4. **Vital Signs**
   - Blood Pressure
   - Heart Rate
   - Pulse Oximetry
   - ECG Findings

5. **Organ Function Tests**
   - Kidney Function (Creatinine, eGFR)
   - Liver Function (AST, ALT)
   - Thyroid Function

6. **Complete Blood Count**
   - Hemoglobin, RBC, WBC, Platelets

7. **Clinical Interpretation**
   - Risk Assessment
   - Key Findings
   - Recommendations
   - Treatment Plan

---

## AI Analysis Features

When you upload these reports, the AI will:

1. **Extract Key Metrics**
   - Glucose levels
   - BMI
   - Blood pressure
   - Heart rate
   - All vital parameters

2. **Risk Classification**
   - Normal (Low Risk)
   - Prediabetic (Moderate Risk)
   - Diabetic (High Risk)

3. **Generate Insights**
   - Trend analysis
   - Personalized recommendations
   - Lifestyle modifications
   - Monitoring guidelines

4. **Create Visualizations**
   - Glucose trend charts
   - BMI tracking
   - Heart rate monitoring
   - Blood pressure graphs

---

## Testing Scenarios

### Scenario 1: Healthy Patient (Priya)
- Upload Priya's report
- See all green/normal indicators
- Receive maintenance recommendations
- View optimal health metrics

### Scenario 2: At-Risk Patient (Rajesh)
- Upload Rajesh's report
- See yellow/warning indicators
- Receive lifestyle modification plan
- View trending health concerns

### Scenario 3: High-Risk Patient (Arjun)
- Upload Arjun's report
- See red/critical indicators
- Receive urgent intervention plan
- View multiple health complications

### Scenario 4: Doctor View
- Login as doctor
- View all patient consultations
- Create new consultation logs
- Manage patient appointments
- See aggregated patient data

---

## File Format

All demo reports are in `.txt` format with structured medical data. The AI system can parse:
- Numerical values (glucose, BMI, BP, etc.)
- Status indicators (Normal, Elevated, High)
- Clinical interpretations
- Recommendations

---

## Notes

- These are **demo reports** for testing purposes only
- Data is fictional but medically realistic
- Reports follow standard medical laboratory format
- All values are within realistic clinical ranges
- Use these to explore all system features

---

## Support

If you encounter any issues:
1. Check that both frontend and backend are running
2. Verify file upload size limits
3. Ensure proper login credentials
4. Check browser console for errors

For questions, refer to the main project documentation.

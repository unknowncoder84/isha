# Doctor Portal Guide

## Overview

The Doctor Portal is a separate in-house authentication system designed specifically for healthcare professionals to manage patient records, appointments, consultations, and health alerts.

## Features

### 1. In-House Authentication
- **No Supabase Auth Required**: Completely separate from patient authentication
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Secure**: Stored in `doctor_users` table with password hashing

### 2. Doctor Dashboard
- Overview of all patients
- Today's appointments
- Pending consultations
- Critical health alerts
- Quick action buttons

### 3. Patient Management
- View all patient records
- Search and filter by name, ID, or risk level
- Add new patients with complete health metrics
- Edit patient information
- Delete patient records
- View patient details and history

### 4. Appointments
- View all scheduled appointments
- See appointment details (date, time, type)
- Track appointment status
- Manage patient appointments

### 5. Consultations
- View consultation history
- Track consultation status (pending, completed, cancelled)
- Add consultation notes
- Monitor patient progress

### 6. Health Alerts
- Real-time health alerts for all patients
- Critical glucose spikes
- Hypoglycemia warnings
- Alert severity levels
- Mark alerts as read

## Access the Doctor Portal

### From Landing Page
1. Go to the main website
2. Click "Doctor Portal" in the navigation menu
3. Login with credentials

### Direct URL
- Development: `http://localhost:3030/doctor/login`
- Production: `https://your-domain.com/doctor/login`

## Login Credentials

### Default Admin Account
```
Username: admin
Password: admin123
```

**IMPORTANT**: Change these credentials in production!

## Database Schema

### doctor_users Table
```sql
CREATE TABLE public.doctor_users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'doctor', 'staff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Adding New Doctor Users

### Via SQL (Recommended for Production)
```sql
INSERT INTO public.doctor_users (username, password_hash, full_name, email, role)
VALUES (
    'dr.smith',
    '$2a$10$...', -- Use bcrypt to hash password
    'Dr. John Smith',
    'john.smith@hospital.com',
    'doctor'
);
```

### Admin Panel (Future Feature)
- Only admins can create new doctor accounts
- Manage user permissions
- Activate/deactivate accounts

## Security Features

### 1. Separate Authentication
- Doctor portal uses its own authentication system
- No interference with patient Supabase auth
- Session stored in localStorage

### 2. Role-Based Access
- **Admin**: Full access to all features
- **Doctor**: Patient management, appointments, consultations
- **Staff**: Limited access (future implementation)

### 3. Session Management
- Automatic logout on browser close
- Session validation on each page
- Redirect to login if not authenticated

## Navigation Structure

```
/doctor
├── /login                    # Login page
└── /dashboard
    ├── /                     # Dashboard home
    ├── /patients             # Patient list
    ├── /add-patient          # Add new patient
    ├── /appointments         # Appointments list
    ├── /consultations        # Consultations list
    └── /alerts               # Health alerts
```

## Features in Detail

### Dashboard Home
- **Stats Cards**: Total patients, today's appointments, pending consultations, critical alerts
- **Recent Patients**: Last 5 patients added
- **Today's Appointments**: All appointments scheduled for today
- **Quick Actions**: Fast access to common tasks

### Patient Management
- **Search**: Find patients by name or ID
- **Filter**: Filter by risk level (Normal, Prediabetic, Diabetic)
- **Actions**: View, Edit, Delete patient records
- **Stats**: Total patients, diabetic count, prediabetic count

### Add Patient Form
Fields:
- Patient Name (required)
- Patient ID (required)
- Age (required)
- Gender (required)
- Glucose Level (optional)
- BMI (optional)
- Blood Pressure (optional)
- Risk Level (required)
- Last Scan Date (required)

### Appointments
- View all appointments
- Sort by date and time
- See patient details
- Track appointment status

### Consultations
- View consultation history
- Filter by status
- Add consultation notes
- Track patient progress

### Alerts
- Real-time health alerts
- Color-coded by severity
- Mark as read/unread
- Filter by alert type

## Customization

### Change Login Credentials
1. Go to Supabase SQL Editor
2. Update the `doctor_users` table:
```sql
UPDATE public.doctor_users
SET password_hash = '$2a$10$NEW_HASH_HERE'
WHERE username = 'admin';
```

### Add New Doctor
```sql
INSERT INTO public.doctor_users (username, password_hash, full_name, email, role)
VALUES (
    'new_doctor',
    '$2a$10$HASHED_PASSWORD',
    'Dr. New Doctor',
    'doctor@hospital.com',
    'doctor'
);
```

### Customize Branding
Edit these files:
- `/app/doctor/login/page.tsx` - Login page
- `/app/doctor/dashboard/layout.tsx` - Dashboard layout
- Update colors, logo, and text

## Production Deployment

### Security Checklist
- [ ] Change default admin password
- [ ] Use proper bcrypt password hashing
- [ ] Enable HTTPS only
- [ ] Set up proper RLS policies
- [ ] Implement rate limiting
- [ ] Add 2FA (future enhancement)
- [ ] Regular security audits

### Environment Variables
No additional environment variables needed - uses same Supabase connection as patient portal.

## Troubleshooting

### Can't Login
1. Check credentials (username: admin, password: admin123)
2. Verify `doctor_users` table exists in Supabase
3. Check browser console for errors
4. Clear localStorage and try again

### Dashboard Not Loading
1. Check Supabase connection
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Ensure user is authenticated

### Patients Not Showing
1. Verify `patient_records` table has data
2. Check RLS policies
3. Ensure proper Supabase configuration
4. Check network tab for API errors

## Future Enhancements

### Planned Features
- [ ] User management panel for admins
- [ ] Two-factor authentication
- [ ] Email notifications
- [ ] Advanced analytics and reports
- [ ] Patient communication system
- [ ] Prescription management
- [ ] Lab results integration
- [ ] Appointment scheduling system
- [ ] Video consultation integration

### API Integration
- [ ] Connect with hospital management systems
- [ ] Integration with lab equipment
- [ ] Electronic health records (EHR) sync
- [ ] Insurance claim processing

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs
3. Check browser console
4. Verify database schema

## Best Practices

### For Doctors
1. Always log out after use
2. Keep credentials secure
3. Regularly review patient alerts
4. Update patient records promptly
5. Document all consultations

### For Administrators
1. Regularly backup database
2. Monitor system usage
3. Review security logs
4. Update user permissions
5. Train new doctors on system use

---

**Last Updated**: March 28, 2026
**Version**: 1.0.0

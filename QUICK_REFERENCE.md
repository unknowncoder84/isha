# 🚀 Quick Reference Guide

## Your App is Running! ✅

### URLs
- **Patient Portal**: http://localhost:3030
- **Doctor Portal**: http://localhost:3030/doctor/login
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

---

## 🔑 Login Credentials

### Patient Portal
- Sign up with any email
- Uses Supabase authentication
- Example: test@example.com / YourPassword123

### Doctor Portal
- **Username**: `admin`
- **Password**: `admin123`
- ⚠️ Change in production!

---

## 🤖 AI Consultant Features

### What It Does
- ✅ Answers ONLY diabetes-related questions
- ✅ Uses your scan data for personalized advice
- ✅ Provides diet, exercise, and health recommendations
- ❌ Rejects non-diabetes questions politely

### Try These Questions
- "How can I lower my blood sugar?"
- "What should I eat for dinner?"
- "Explain my scan results"
- "What exercises are best for diabetes?"

### Won't Answer
- "What's the weather?"
- "Tell me a joke"
- "How to fix my car?"
- Any non-diabetes topics

---

## 🏥 Doctor Portal Features

### Dashboard
- Total patients count
- Today's appointments
- Pending consultations
- Critical alerts

### Patients
- View all patients
- Search by name/ID
- Filter by risk level
- Add/Edit/Delete patients

### Appointments
- View schedule
- Track status
- Patient details

### Consultations
- History tracking
- Add notes
- Monitor progress

### Alerts
- Real-time notifications
- Severity levels
- Mark as read

---

## 📋 Quick Actions

### Add a Patient (Doctor Portal)
1. Login to doctor portal
2. Click "Add Patient" or go to Patients → Add Patient
3. Fill form:
   - Name, ID, Age, Gender (required)
   - Glucose, BMI, BP (optional)
   - Risk level (required)
4. Click "Save Patient"

### Upload Medical Report (Patient Portal)
1. Login to patient portal
2. Go to "Upload" page
3. Select PDF file
4. AI extracts data automatically
5. View results in dashboard

### Chat with AI (Patient Portal)
1. Go to "Chat" page
2. Ask diabetes-related questions
3. Get personalized advice
4. View chat history

---

## 🗄️ Database Setup

### First Time Setup
1. Open Supabase dashboard
2. Go to SQL Editor
3. Copy contents of `SUPABASE_SETUP_IMPROVED.sql`
4. Paste and run
5. Verify tables created

### Tables Created
- `profiles` - User profiles
- `patient_records` - Patient data
- `health_records` - Health metrics
- `appointments` - Appointments
- `consultations` - Consultations
- `alerts` - Health alerts
- `medical_documents` - Uploaded files
- `chat_messages` - AI chat history
- `doctor_users` - Doctor authentication

---

## 🔧 Common Commands

### Start Everything
```bash
npm run dev:all
```

### Start Frontend Only
```bash
npm run dev
```

### Start Backend Only
```bash
npm run backend
```

### Build for Production
```bash
npm run build
```

---

## 🐛 Troubleshooting

### Can't Login to Doctor Portal
- Check username: `admin`
- Check password: `admin123`
- Clear browser cache
- Check `doctor_users` table exists

### AI Not Responding
- Check OpenRouter API key (optional)
- AI works with pre-configured responses
- Try diabetes-related questions

### Data Not Showing
- Run SQL schema in Supabase
- Check RLS policies
- Verify Supabase connection
- Check browser console

### Build Errors
- Clear `.next` folder
- Run `npm install`
- Check Node version (20.x)

---

## 📚 Documentation Files

1. **QUICK_START.md** - Get started in 5 minutes
2. **SETUP_COMPLETE.md** - Full setup details
3. **DOCTOR_PORTAL_GUIDE.md** - Doctor portal guide
4. **NEW_FEATURES_SUMMARY.md** - All new features
5. **NETLIFY_DEPLOYMENT_GUIDE.md** - Deploy to production
6. **TEST_CHECKLIST.md** - Testing guide
7. **QUICK_REFERENCE.md** - This file

---

## ✅ Feature Checklist

### Patient Portal
- [x] User authentication
- [x] Dashboard with health metrics
- [x] Upload medical reports
- [x] AI chat consultant (diabetes-only)
- [x] Appointments management
- [x] Consultations tracking
- [x] Health alerts
- [x] Profile management

### Doctor Portal
- [x] In-house authentication
- [x] Doctor dashboard
- [x] Patient management
- [x] Add/Edit/Delete patients
- [x] Appointments view
- [x] Consultations view
- [x] Health alerts monitoring
- [x] Search and filter

### AI Features
- [x] Diabetes-specific responses
- [x] Scan data integration
- [x] Personalized advice
- [x] Non-diabetes question rejection
- [x] Pre-configured responses

---

## 🚀 Deployment

### Netlify (Frontend)
1. Push to GitHub
2. Connect to Netlify
3. Add environment variables
4. Deploy
5. See `NETLIFY_DEPLOYMENT_GUIDE.md`

### Backend Options
- Railway
- Render
- Heroku
- AWS/GCP/Azure

---

## 📞 Quick Help

### Issue: "Invalid supabaseUrl"
**Solution**: Check `.env.local` file has correct Supabase URL

### Issue: "Can't add patient"
**Solution**: Run SQL schema, check RLS policies

### Issue: "AI not working"
**Solution**: AI works without API key using pre-configured responses

### Issue: "Doctor login fails"
**Solution**: Username: admin, Password: admin123 (case-sensitive)

---

## 🎯 Next Steps

1. ✅ Run SQL schema in Supabase
2. ✅ Test patient portal
3. ✅ Test doctor portal
4. ✅ Add test patients
5. ✅ Try AI chat
6. ✅ Review all features
7. ⏳ Deploy to Netlify
8. ⏳ Change admin password
9. ⏳ Add more doctors
10. ⏳ Go live!

---

## 💡 Pro Tips

### For Best Experience
- Use Chrome or Firefox
- Enable JavaScript
- Allow cookies
- Use desktop for doctor portal
- Mobile-friendly patient portal

### For Development
- Keep servers running
- Check console for errors
- Use React DevTools
- Monitor Supabase logs
- Test on multiple devices

### For Production
- Change default passwords
- Enable HTTPS
- Set up monitoring
- Regular backups
- Security audits

---

## 🎉 You're All Set!

Your diabetes management system is ready with:
- ✅ Smart AI consultant
- ✅ Complete doctor portal
- ✅ Patient management
- ✅ Running on port 3030
- ✅ Ready for deployment

**Start exploring at http://localhost:3030**

---

**Need Help?** Check the documentation files or review the setup guides!

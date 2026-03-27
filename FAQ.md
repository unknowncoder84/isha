# Frequently Asked Questions (FAQ)

Complete guide to common questions about the Diabetes Management System.

## 📋 Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Features & Functionality](#features--functionality)
- [Technical Questions](#technical-questions)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Data & Privacy](#data--privacy)

---

## General Questions

### What is the Diabetes Management System?

The Diabetes Management System is a web application designed to help individuals monitor and manage their diabetes-related health metrics. It provides:
- Health dashboard with key metrics
- AI-powered medical report analysis
- Appointment reminder system
- Health insights and recommendations
- AI health consultant chatbot

### Who is this application for?

This application is designed for:
- Individuals managing diabetes or prediabetes
- People monitoring their health metrics
- Anyone wanting to track medical appointments
- Users seeking AI-powered health insights
- Healthcare enthusiasts

### Is this a real medical application?

**No**, this is a demo/educational application. The AI analysis is simulated and should NOT be used for actual medical decisions. Always consult with qualified healthcare professionals for medical advice.

### Is the application free to use?

Yes, the application is completely free and open-source under the MIT License.

### Do I need to create an account?

Yes, you need to create an account to use the dashboard features. However, account creation is simple - just enter any email and password (demo mode).

---

## Installation & Setup

### What are the system requirements?

**Minimum Requirements**:
- Node.js 20.9.0 or higher
- 2GB RAM
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

**Recommended**:
- Node.js 20.11.0 or higher
- 4GB RAM
- Latest version of Chrome or Firefox

### How do I install the application?

```bash
# 1. Clone the repository
git clone https://github.com/unknowncoder84/dibeties.git

# 2. Navigate to project directory
cd dibeties

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev

# 5. Open browser to http://localhost:3000
```

### What if I get an error during installation?

**Common solutions**:

1. **Node version error**: Ensure you have Node.js 20.9.0+
   ```bash
   node --version  # Should show v20.9.0 or higher
   ```

2. **npm install fails**: Try clearing cache
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Port 3000 already in use**: Use a different port
   ```bash
   npm run dev -- -p 3001
   ```

### Do I need a database?

No, the application uses browser localStorage for data storage. No database setup is required for basic functionality.

### Can I use Supabase for data storage?

Yes, Supabase integration is prepared but not required. To use Supabase:

1. Create a Supabase project
2. Add environment variables to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
3. Run the SQL schema from `SUPABASE_SQL_SCHEMA.sql`

---

## Features & Functionality

### How do I upload a medical report?

1. Login to your account
2. Go to "Upload Reports" from the sidebar
3. Drag and drop a file or click to browse
4. Supported formats: PDF, images (.jpg, .png), text files (.txt)
5. Wait for AI analysis to complete
6. View results on the dashboard

### What file formats are supported for upload?

Supported formats:
- PDF (.pdf)
- Images (.jpg, .jpeg, .png)
- Text files (.txt)

### How does the AI analysis work?

The AI analysis is **simulated** for demo purposes:

1. **File Upload**: System reads the file content
2. **Data Extraction**: Simulates OCR to extract patient info
3. **Analysis**: Generates random but realistic health metrics
4. **Risk Classification**: Calculates risk level based on glucose
5. **Recommendations**: Provides health advice based on risk level

**Note**: This is NOT real AI analysis. Do not use for medical decisions.

### Why do my metrics show "N/A"?

Metrics show "N/A" when:
- You haven't uploaded any medical report yet
- No scan data is available
- You're using a new account

**Solution**: Upload a medical report to populate the metrics.

### How do I use the File Converter?

The File Converter helps you create custom test files:

1. Go to "Upload Reports" page
2. Click "File Converter" button (top-right)
3. Upload any file (PDF, TXT, DOC, DOCX)
4. System converts it to demo medical report format
5. Preview the converted text
6. Click "Download Converted File"
7. Use the downloaded file for testing

### What is the Health Score pie chart?

The Health Score pie chart shows:
- **Health Score** (green): Your confidence percentage
- **Risk Factor** (red): Remaining percentage (100 - confidence)

It's calculated based on your uploaded medical report analysis.

### How do appointment reminders work?

Appointment reminders are personal reminders for your medical appointments:

1. Go to "Appointments" page
2. Click "Set Reminder"
3. Fill in doctor name, date, time, and notes
4. Click "Set Reminder"
5. View upcoming reminders on dashboard
6. Mark as "Done" or "Remove" when complete

### Can I chat with the AI consultant?

Yes! The AI Health Consultant provides:
- 24/7 chat interface
- Context-aware responses (references your uploaded reports)
- Suggested questions for quick access
- Personalized health advice

**Note**: This is simulated AI. Always consult real healthcare professionals.

### How do I view my health alerts?

1. Click the bell icon in the top-right corner
2. Or go to "Alerts" from the sidebar
3. View all alerts (spike, hypo, warning, normal)
4. Click on an alert to mark it as read
5. Unread alerts show a red counter badge

---

## Technical Questions

### What technologies are used?

**Frontend**:
- Next.js 16.1.6 (React framework)
- TypeScript 5.0 (type-safe JavaScript)
- Tailwind CSS 3.4 (styling)
- shadcn/ui (UI components)
- Recharts (data visualization)

**State Management**:
- React Context API

**Data Storage**:
- Browser localStorage

**Build Tool**:
- Turbopack (Next.js bundler)

### Why Next.js?

Next.js provides:
- Server-side rendering (SSR)
- Static site generation (SSG)
- App Router for better routing
- Built-in optimization
- Great developer experience
- Easy deployment

### Why TypeScript?

TypeScript offers:
- Type safety (catch errors early)
- Better IDE support
- Improved code quality
- Self-documenting code
- Easier refactoring

### Why localStorage instead of a database?

localStorage is used for:
- **Simplicity**: No database setup required
- **Demo Purpose**: Easy to test and demo
- **Privacy**: Data stays on user's device
- **No Backend**: Reduces complexity

For production, you can integrate Supabase or another database.

### How is data structured in localStorage?

```javascript
// Authentication
glucovision_auth: "true" | "false"
glucovision_user: { name, email }
glucovision_users: { [email]: { name, password } }

// Health Data
glucovision_scanResult: ScanResult object
glucovision_patientRecords: PatientRecord[]

// App Data
glucovision_alerts: Alert[]
glucovision_consultations: Consultation[]
glucovision_appointments: Appointment[]
```

### Can I customize the UI?

Yes! The UI is built with Tailwind CSS and shadcn/ui:

1. **Colors**: Edit `tailwind.config.ts`
2. **Components**: Modify files in `components/ui/`
3. **Styles**: Update `app/globals.css`
4. **Theme**: Adjust color variables

### How do I add new features?

1. Create new component in `components/`
2. Add new page in `app/dashboard/`
3. Update navigation in `app/dashboard/layout.tsx`
4. Add state management in `lib/app-context.tsx`
5. Test and build

---

## Troubleshooting

### The application won't start

**Check**:
1. Node.js version: `node --version` (should be 20.9.0+)
2. Dependencies installed: `npm install`
3. Port availability: Try different port `npm run dev -- -p 3001`
4. Clear cache: `npm cache clean --force`

### Build fails with errors

**Solutions**:
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Build again: `npm run build`

### Data is not persisting

**Check**:
1. Browser localStorage is enabled
2. Not in incognito/private mode
3. Browser has storage space available
4. Check browser console for errors

### Uploaded file is not processing

**Verify**:
1. File format is supported (PDF, JPG, PNG, TXT)
2. File size is reasonable (< 10MB)
3. File is not corrupted
4. Browser console shows no errors

### Dashboard shows "N/A" for all metrics

**This is normal** if:
- You haven't uploaded any medical report yet
- You're using a new account
- No scan data is available

**Solution**: Upload a medical report from the "Upload Reports" page.

### Login doesn't work

**Check**:
1. Email and password are entered correctly
2. Account exists (or create new one)
3. Browser localStorage is enabled
4. No browser extensions blocking localStorage

### Charts are not displaying

**Solutions**:
1. Ensure scan data is uploaded
2. Check browser console for errors
3. Try refreshing the page
4. Clear browser cache

---

## Deployment

### How do I deploy to Netlify?

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site"
   - Choose GitHub repository

3. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20.11.0 (in netlify.toml)

4. **Deploy**: Click "Deploy site"

### What is the netlify.toml file?

The `netlify.toml` file configures Netlify deployment:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20.11.0"
```

It ensures the correct Node version and build settings.

### Can I deploy to Vercel?

Yes! Vercel is actually the recommended platform for Next.js:

1. Push to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Deploy (automatic configuration)

### How do I set up a custom domain?

**On Netlify**:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

**On Vercel**:
1. Go to Project settings → Domains
2. Add your domain
3. Configure DNS records
4. SSL is automatic

### Do I need environment variables for deployment?

**Not required** for basic functionality (uses localStorage).

**Optional** if using Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add these in your deployment platform's environment variables section.

---

## Data & Privacy

### Where is my data stored?

All data is stored in your browser's localStorage:
- **Location**: Your device only
- **Persistence**: Until you clear browser data or logout
- **Privacy**: Not sent to any server
- **Security**: Protected by browser security

### Is my data secure?

**Current Implementation** (Demo Mode):
- Data stored in browser localStorage
- Not encrypted
- Accessible only on your device
- Cleared on logout

**For Production**:
- Use HTTPS (automatic on Netlify/Vercel)
- Implement proper authentication
- Use encrypted database (Supabase)
- Follow HIPAA compliance if handling real medical data

### Can others see my data?

No, your data is stored locally in your browser and is not shared with anyone.

### What happens when I logout?

When you logout:
- Authentication status is cleared
- User session is removed
- Scan results are cleared
- You're redirected to the login page

**Note**: Other data (appointments, alerts) persists until you clear browser data.

### How do I delete my data?

**Option 1**: Logout (clears some data)

**Option 2**: Clear browser data
1. Open browser settings
2. Go to Privacy/Security
3. Clear browsing data
4. Select "Cookies and site data"
5. Clear data

**Option 3**: Clear localStorage manually
```javascript
// Open browser console (F12)
localStorage.clear()
```

### Is this HIPAA compliant?

**No**, this is a demo application and is NOT HIPAA compliant. Do not use for real medical data.

For HIPAA compliance, you would need:
- Encrypted data storage
- Secure authentication
- Audit logs
- Business Associate Agreements
- Proper security measures

### Can I use this for real medical data?

**No**, this application is for educational and demo purposes only. Do not use for:
- Real medical decisions
- Storing actual patient data
- Clinical diagnosis
- Treatment planning

Always consult qualified healthcare professionals for medical advice.

---

## Additional Questions

### How do I contribute to the project?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [README.md](./README.md) for detailed contribution guidelines.

### Where can I report bugs?

Report bugs on GitHub:
1. Go to [Issues](https://github.com/unknowncoder84/dibeties/issues)
2. Click "New Issue"
3. Describe the bug with steps to reproduce
4. Include screenshots if possible

### How do I request new features?

1. Open an issue on GitHub
2. Label it as "feature request"
3. Describe the feature and use case
4. Explain why it would be valuable

### Is there a mobile app?

No, but the web application is fully responsive and works great on mobile browsers.

### Can I use this commercially?

Yes, the project is licensed under MIT License, which allows commercial use. However:
- Provide attribution
- Include the license
- Do not use for actual medical purposes without proper compliance

### How often is the project updated?

The project is actively maintained. Check the GitHub repository for:
- Latest commits
- Release notes
- Upcoming features

### Where can I get help?

1. Check this FAQ
2. Read the [README.md](./README.md)
3. Open an issue on GitHub
4. Check browser console for errors

---

## Still Have Questions?

If your question isn't answered here:

1. **Check the README**: [README.md](./README.md)
2. **Search GitHub Issues**: [Issues](https://github.com/unknowncoder84/dibeties/issues)
3. **Open a New Issue**: Describe your question in detail
4. **Check the Code**: The codebase is well-documented

---

**Last Updated**: March 7, 2026

**Project**: Diabetes Management System

**Repository**: [github.com/unknowncoder84/dibeties](https://github.com/unknowncoder84/dibeties)

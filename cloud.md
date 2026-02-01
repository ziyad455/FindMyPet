# FindMyPet – AI Project Specification

## Project Overview

**FindMyPet** is a web application that enables pet owners to submit their pet information and allows administrators to manage submissions and generate QR codes. The app is built with modern web technologies and leverages Firebase for backend services.

---

## Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS
- **Backend Services**: Firebase
  - Authentication (Email/Password)
  - Firestore Database
  - Storage (Image uploads)
- **QR Code**: Client-side generation with downloadable PNG
- **Internationalization**: Arabic & French support via JSON files

---

## Roles & Permissions

### 1. User (Pet Owner)

**Authentication:**
- Login with email + password

**Capabilities:**
- Submit pet information via form with the following fields:
  - Owner Name
  - Pet Name
  - Phone Number
  - Pet Photo (uploaded)
  - Message/Description
- View personal dashboard with own submissions
- Edit own submissions
- Receive thank-you message after submission with next steps and contact info

**Restrictions:**
- Cannot view other users' submissions
- Cannot access QR codes
- Cannot approve/reject submissions

### 2. Admin

**Authentication:**
- Login with email + password

**Capabilities:**
- View all submissions in admin dashboard
- For each submission:
  - **Approve**: Generate QR code → Download as PNG → Update status to "approved"
  - **Reject/Delete**: Remove submissions from system
  - **Download QR**: For approved submissions
- Manage all pet information
- Full CRUD operations on all submissions

**Note:** All admin actions (delete, update, approve, reject) are immediately synchronized with Firebase.

---

## User Flows

### 1. Landing Page
- **Purpose**: Introduction to the service
- **Content**: 
  - Explanation of what FindMyPet offers
  - Call-to-action button to navigate to submission form
  - All text loaded from `ar.json` / `fr.json` (no hard-coded strings)

### 2. Form Page (Pet Submission)
- User fills out pet information form
- User uploads pet photo
- **Firebase Actions:**
  - Form data saved to Firestore with `status = "pending"`
  - Pet photo uploaded to Firebase Storage
  - User redirected to thank-you message

### 3. User Dashboard
- User logs in with email/password
- Views list of own submissions
- Can edit submission details
- **Firebase Actions:**
  - All edits immediately update Firestore
  - Photo changes update Firebase Storage

### 4. Admin Dashboard
- Admin logs in with email/password
- Views all pending submissions
- **Admin Actions:**
  - **Approve**: 
    - Generate QR code linking to `/pet/{id}`
    - Download QR as PNG
    - Update Firestore status to "approved"
  - **Reject/Delete**: 
    - Remove from Firestore
    - Delete associated images from Storage
- **Firebase Actions:**
  - All changes (approve, reject, delete) sync immediately to Firebase
  - Status updates reflected in real-time

### 5. QR Page (`/pet/{id}`)
- **Public Access**: Anyone with the link can view
- **Content Displayed:**
  - Pet information
  - Owner information
  - Pet photo
- **Security**: Deleted or rejected submissions return 404 or access denied

---

## Technical Requirements

### Architecture

**Folder Structure:**
```
/src
  /components      → Reusable UI components
  /pages           → LandingPage, FormPage, UserDashboard, AdminDashboard, PetPage
  /hooks           → Custom hooks (useAuth, useFirestore, etc.)
  /services        → Firebase services (Auth, Firestore, Storage)
  /types           → TypeScript types/interfaces
  /context         → AuthContext, LanguageContext
  /i18n            → ar.json, fr.json
  firebase.js      → Firebase initialization
```

### Firebase Configuration

**Setup:**
- Firebase config stored in `firebase.js`
- Environment variables in `.env` file:
  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  ```

**Firestore Collection Structure:**
```typescript
// pets collection
{
  id: string,
  userId: string,
  ownerName: string,
  petName: string,
  phone: string,
  photoUrl: string,
  message: string,
  status: "pending" | "approved" | "rejected",
  qrCodeUrl?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Firebase Synchronization:**
> **CRITICAL**: All delete and update operations must immediately synchronize with Firebase:
> - Deleting a submission removes it from Firestore AND deletes the associated image from Storage
> - Updating a submission updates the document in Firestore in real-time
> - Changing submission status (approve/reject) updates Firestore immediately
> - Uploading new photos replaces old ones in Storage and updates the URL in Firestore

### Form Validation

All form inputs must be validated:
- **Owner Name**: Required, min 2 characters
- **Pet Name**: Required, min 2 characters
- **Phone**: Required, valid phone format
- **Photo**: Required, max 5MB, accepted formats: jpg, png, webp
- **Message**: Optional, max 500 characters

### Security Rules

**Firestore Rules:**
```javascript
// Users can only read/write their own submissions
// Admins can read/write all submissions
// Authentication required for all operations
```

**Storage Rules:**
```javascript
// Users can upload images for their submissions
// Admins can delete any images
// Public read access for approved pet images
```

**Role-Based Access:**
- User role stored in Firestore `users` collection
- Admin role checked before sensitive operations
- Client-side AND server-side (Firestore rules) validation

### Internationalization (i18n)

**Language Files:**
- `ar.json` - Arabic translations
- `fr.json` - French translations

**Features:**
- No hard-coded text strings in components
- Language preference stored in cookies or localStorage
- Language toggle in UI (header/footer)
- RTL support for Arabic

**Example Structure:**
```json
{
  "landing": {
    "title": "Find Your Lost Pet",
    "description": "...",
    "ctaButton": "Submit Pet Information"
  },
  "form": {
    "ownerName": "Owner Name",
    "petName": "Pet Name",
    // ...
  }
}
```

### QR Code Generation

**Implementation:**
- Generate QR codes client-side using a library (e.g., `qrcode.react` or `qrcode`)
- QR code links to: `https://yourdomain.com/pet/{petId}`
- Download as PNG with pet name in filename
- Store QR code URL in Firestore (optional)

**Example:**
```typescript
// Generate QR code for approved submission
const qrData = `https://findmypet.com/pet/${petId}`;
// Download as: {petName}-QR-Code.png
```

---

## Development Instructions

### Setup Steps

1. **Initialize Project:**
   ```bash
   npm create vite@latest findmypet -- --template react-ts
   cd findmypet
   npm install
   ```

2. **Install Dependencies:**
   ```bash
   npm install firebase
   npm install tailwindcss postcss autoprefixer
   npm install react-router-dom
   npm install qrcode.react
   npm install i18next react-i18next
   npm install js-cookie
   npm install @types/js-cookie --save-dev
   ```

3. **Configure Tailwind CSS:**
   ```bash
   npx tailwindcss init -p
   ```

4. **Set up Firebase:**
   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Add configuration to `.env`

5. **Create Folder Structure:**
   - Follow the structure outlined above
   - Set up routing with React Router
   - Create context providers (Auth, Language)

### Code Quality Requirements

- **TypeScript**: Strict type checking, interfaces for all data structures
- **Comments**: Add comments for:
  - Firebase operations (read, write, delete)
  - QR code generation logic
  - Role/permission checks
  - Complex business logic
- **Error Handling**: Try-catch blocks for async operations, user-friendly error messages
- **Responsive Design**: Mobile-first approach, test on various screen sizes
- **Performance**: Lazy loading for images, code splitting for routes

### Production Readiness

- [ ] Environment variables properly configured
- [ ] Firebase security rules implemented
- [ ] Form validation on client and server
- [ ] Error boundaries for React components
- [ ] Loading states for async operations
- [ ] 404 page for invalid routes
- [ ] Proper Firebase cleanup (unsubscribe from listeners)
- [ ] Image optimization before upload
- [ ] Build optimization (Vite production build)

---

## Key Features Summary

✅ **User Authentication** - Email/Password with Firebase Auth  
✅ **Pet Submission Form** - With image upload and validation  
✅ **User Dashboard** - View and edit own submissions  
✅ **Admin Dashboard** - Manage all submissions, approve/reject  
✅ **QR Code Generation** - Client-side generation, downloadable PNG  
✅ **Public Pet Pages** - Accessible via QR code link  
✅ **Bilingual Support** - Arabic & French with RTL support  
✅ **Firebase Sync** - Real-time updates, deletes, and edits synchronized  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Secure** - Role-based access control, Firebase security rules  

---

## Additional Notes

### Firebase Real-Time Synchronization

**Important**: This application requires immediate synchronization between the client and Firebase:

1. **Delete Operations:**
   - When a submission is deleted, both the Firestore document AND the associated Storage image must be removed
   - Admin deletes should cascade to all related data

2. **Update Operations:**
   - Any edit to a submission must immediately update the Firestore document
   - Photo changes must upload new file to Storage, delete old file, and update URL in Firestore
   - Use `onSnapshot` for real-time updates in dashboards

3. **Status Changes:**
   - Approving a submission updates `status` field in Firestore
   - Generate and optionally store QR code URL
   - Rejecting a submission can either soft-delete (status change) or hard-delete (remove from DB)

### Recommended Firebase Listeners

Use Firestore real-time listeners for:
- Admin dashboard (all submissions)
- User dashboard (user's submissions)
- Pet detail page (single pet data)

This ensures the UI always reflects the current state of the database.

---

## Deliverables

A production-ready web application with:
- Complete source code following the folder structure
- Firebase configuration and security rules
- Bilingual support (AR/FR)
- Responsive, accessible UI
- Comprehensive comments and documentation
- `.env.example` file with required environment variables
- README.md with setup instructions

---

**End of Specification**
# FindMyPet 🐾

A web application that enables pet owners to submit their pet information and allows administrators to manage submissions and generate QR codes. Built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

✅ **User Authentication** - Email/Password with Firebase Auth  
✅ **Pet Submission Form** - With image upload and validation  
✅ **User Dashboard** - View and edit own submissions  
✅ **Admin Dashboard** - Manage all submissions, approve/reject  
✅ **QR Code Generation** - Client-side generation, downloadable PNG  
✅ **Public Pet Pages** - Accessible via QR code link  
✅ **Bilingual Support** - Arabic & French with RTL support  
✅ **Firebase Sync** - Real-time updates, deletes, and edits synchronized  
✅ **Responsive Design** - Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **QR Code**: qrcode.react
- **Internationalization**: Custom i18n with JSON files
- **Routing**: React Router v6

## Project Structure

```
/src
  /components      → Reusable UI components
  /pages           → LandingPage, FormPage, UserDashboard, AdminDashboard, PetPage
  /hooks           → Custom hooks (useFirestore, useFormValidation)
  /services        → Firebase services (Auth, Firestore, Storage)
  /types           → TypeScript types/interfaces
  /context         → AuthContext, LanguageContext
  /i18n            → ar.json, fr.json
  firebase.ts      → Firebase initialization
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/findmypet.git
   cd findmypet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Enable Storage
   - Deploy security rules:
     ```bash
     firebase deploy --only firestore:rules,storage
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Visit [http://localhost:5173](http://localhost:5173)

## Firebase Setup

### Firestore Collections

**users**
```typescript
{
  email: string,
  displayName: string,
  role: "user" | "admin",
  createdAt: timestamp
}
```

**pets**
```typescript
{
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

### Creating an Admin User

1. Register a new user through the app
2. In Firebase Console, go to Firestore
3. Find the user document in the `users` collection
4. Change `role` from `"user"` to `"admin"`

### Security Rules

Security rules are provided in:
- `firestore.rules` - Firestore database rules
- `storage.rules` - Storage bucket rules

Deploy them using:
```bash
firebase deploy --only firestore:rules,storage
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Internationalization

The app supports Arabic and French. Language files are located in `/src/i18n/`:

- `ar.json` - Arabic translations (RTL)
- `fr.json` - French translations (LTR)

To add more languages, create a new JSON file and update `LanguageContext.tsx`.

## License

This project is licensed under the MIT License.

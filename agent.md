# Agent Instructions for FindMyPet Project

## Project Overview
- Project: FindMyPet
- Goal: Pet adoption/tracking platform
- Tech Stack:
  - Frontend: React + Vite + Tailwind CSS + React Router
  - Authentication: Firebase Auth
  - Database: Firestore
- Key Feature: Admin dashboard access is controlled via Firebase Auth + Firestore collection "admins"

---

## Coding Rules
- Use **functional components** only
- Prefer **React Hooks** over class components
- No inline CSS; use **Tailwind classes**
- Write **clean, readable, modular code**
- Use **async/await** for Firestore operations
- No hardcoded emails for admin checks; always query Firestore "admins" collection

---

## Folder Structure
- `/src/components` → reusable UI components
- `/src/pages` → page-level components (Home, AdminDashboard, Login, etc.)
- `/src/firebase.js` → Firebase config and exports
- `/src/utils` → helper functions (e.g., `checkAdmin`)
- `/public` → static assets

---

## Features / Logic
1. **User Authentication**
   - Firebase Auth handles sign-up, login, logout
   - After login, check if user is admin:
     ```javascript
     import { doc, getDoc } from "firebase/firestore";
     import { db } from "./firebase";

     const checkAdmin = async (email) => {
       const adminRef = doc(db, "admins", email);
       const adminSnap = await getDoc(adminRef);
       return adminSnap.exists();
     };
     ```
   - Redirect based on admin status

2. **Admin Access**
   - Admin users stored in Firestore collection `admins`
   - Admin dashboard accessible only if `checkAdmin(email)` returns true
   - Non-admin users are redirected to `/`

3. **Firebase Rules**
   - Keep Firestore rules secure
   - Only allow admin collection read for server/admin logic

4. **General UI/UX**
   - Use Tailwind for styling
   - Responsive design
   - Smooth transitions/animations where possible

---

## AI Agent Guidelines
- **When generating code**: always respect project folder structure
- **When suggesting admin logic**: never hardcode emails, always use Firestore check
- **When refactoring**: maintain functional components and hooks
- **When creating new features**: follow existing coding style and naming conventions
- **Comments**: generate meaningful comments for clarity, especially around Firebase logic

---

## Notes
- Do not add backend; all admin logic is in React + Firestore
- Admin emails can change; code should be adaptable
- Security is important: prevent unauthorized access

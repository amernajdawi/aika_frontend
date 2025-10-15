# AIKA Login System

## Overview
A simple authentication system has been added to the AIKA frontend application. Users must log in before accessing the main chat interface.

## Features
- **Simple Username/Password Authentication**: No complex OAuth or external services
- **Persistent Login**: Users stay logged in across browser sessions
- **Secure Password Storage**: Passwords are not stored in localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode Support**: Consistent with the main application theme
- **Demo User Information**: Login page shows available demo accounts

## Available Users

| Username | Password | Display Name |
|----------|----------|--------------|
| Amernaj | Amer&1234 | Amernaj |
| Florian plakolb | Florian&1234 | Florian Plakolb |
| Michaela plakolb | Michaela&1234 | Michaela Plakolb |
| test1 | test1&1234 | Test User 1 |

## Technical Implementation

### Files Added/Modified
- `types/auth.ts` - Authentication type definitions
- `hooks/useAuth.ts` - Authentication state management hook
- `components/LoginPage.tsx` - Login page component
- `components/Header.tsx` - Added logout functionality
- `components/Chat.tsx` - Integrated authentication
- `app/page.tsx` - Added authentication flow
- `app/globals.css` - Added login-specific styles

### Authentication Flow
1. **App Load**: Check localStorage for existing user session
2. **Not Authenticated**: Show login page
3. **Login Success**: Store user info (without password) in localStorage
4. **Authenticated**: Show main chat interface
5. **Logout**: Clear localStorage and return to login page

### Security Notes
- Passwords are only used for authentication and are not stored
- User sessions persist in localStorage (can be cleared by user)
- No server-side authentication (client-side only)
- Demo users are hardcoded for simplicity

## Usage

### For Users
1. Open the application
2. Enter username and password from the available accounts
3. Click "Sign In" to access the chat interface
4. Use the logout button (red icon) in the header to sign out

### For Developers
- Add new users by modifying the `USERS` array in `hooks/useAuth.ts`
- Customize login page styling in `components/LoginPage.tsx`
- Authentication state is managed by the `useAuth` hook
- All authentication logic is contained in the frontend

## Future Enhancements
- Server-side authentication
- User registration
- Password reset functionality
- Role-based access control
- Session timeout
- Remember me functionality

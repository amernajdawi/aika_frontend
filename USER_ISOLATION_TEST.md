# User Isolation Test Guide

## Overview
The AIKA application now properly isolates conversations between different users. Each user only sees their own conversations and cannot access other users' data.

## How to Test User Isolation

### Test Scenario 1: Different Users, Separate Conversations

1. **Login as User 1 (Amernaj)**
   - Username: `Amernaj`
   - Password: `Amer&1234`
   - Ask a question: "What is VSME?"
   - Note the conversation appears in the sidebar

2. **Logout and Login as User 2 (Florian)**
   - Click the red logout button in header
   - Login with:
     - Username: `Florian plakolb`
     - Password: `Florian&1234`
   - **Expected Result**: No previous conversations visible
   - Ask a different question: "What are the requirements for manufacturing?"
   - Note this conversation appears in the sidebar

3. **Logout and Login as User 1 Again**
   - Click logout button
   - Login as `Amernaj` again
   - **Expected Result**: Only Amernaj's VSME conversation is visible
   - Florian's manufacturing conversation should NOT be visible

### Test Scenario 2: Multiple Conversations Per User

1. **Login as User 1 (Amernaj)**
   - Ask question 1: "What is VSME?"
   - Click "New Chat" button
   - Ask question 2: "What are the CSRD requirements?"
   - **Expected Result**: Both conversations visible in sidebar

2. **Logout and Login as User 2 (test1)**
   - Login with:
     - Username: `test1`
     - Password: `test1&1234`
   - **Expected Result**: No conversations visible (fresh start)
   - Ask question: "What is the EU Taxonomy?"
   - **Expected Result**: Only this conversation visible

3. **Switch Back to User 1**
   - Logout and login as `Amernaj`
   - **Expected Result**: Both VSME and CSRD conversations visible
   - User 2's EU Taxonomy conversation should NOT be visible

## Technical Implementation

### What Changed:
1. **Conversation Interface**: Added `userId` field to associate conversations with specific users
2. **Storage Logic**: Conversations are filtered by user when loading and saving
3. **User Association**: Each conversation is tied to the username of the logged-in user
4. **Data Isolation**: Users can only see and modify their own conversations

### Storage Structure:
```json
{
  "conversations": [
    {
      "id": "conv-1",
      "title": "VSME Question",
      "messages": [...],
      "userId": "Amernaj",
      "lastUpdated": "2025-01-27T10:00:00Z"
    },
    {
      "id": "conv-2", 
      "title": "Manufacturing Requirements",
      "messages": [...],
      "userId": "Florian plakolb",
      "lastUpdated": "2025-01-27T10:05:00Z"
    }
  ]
}
```

### Key Features:
- ✅ **User Isolation**: Each user only sees their own conversations
- ✅ **Persistent Storage**: Conversations persist across browser sessions
- ✅ **Multi-User Support**: Multiple users can use the same browser
- ✅ **Data Integrity**: No cross-contamination between users
- ✅ **Automatic Cleanup**: Old conversations from other users are preserved

## Expected Behavior Summary

| Action | User A | User B | Result |
|--------|--------|--------|--------|
| User A asks question | Sees conversation | - | ✅ Isolated |
| User A logs out | - | - | Data preserved |
| User B logs in | - | Sees empty chat | ✅ Fresh start |
| User B asks question | - | Sees conversation | ✅ Isolated |
| User B logs out | - | - | Data preserved |
| User A logs back in | Sees old conversation | - | ✅ Data restored |

This ensures complete privacy and data isolation between users while maintaining a seamless experience for each individual user.

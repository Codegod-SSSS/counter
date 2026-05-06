# Firebase Security Specification

## Data Invariants
1. A user can only access their own profile (`/users/{userId}`).
2. Expenses, Categories, and Goals are sub-resources of a user and can only be accessed by that specific user.
3. Payment methods for expenses must be one of: 'Cash', 'Mobile Money', 'Bank'.
4. Budget types must be one of: 'daily', 'weekly', 'monthly', 'yearly'.
5. All IDs must match `^[a-zA-Z0-9_\\-]+$`.

## The "Dirty Dozen" Payloads (Red Team Tests)
1. **Identity Theft**: Attempt to write to `/users/other-user-id` as currentUser.
2. **Resource Poisoning**: Attempt to create an expense with a 2MB string as notes.
3. **Ghost Field**: Attempt to add `isAdmin: true` to a user profile.
4. **Invalid Type**: Attempt to set `amount` as a string instead of a number.
5. **State Shortcut**: Attempt to set `onboarded: true` without setting `budgetAmount`.
6. **Orphaned Write**: Attempt to create an expense for a non-existent category.
7. **Cross-User Access**: Attempt to read `/users/other-user-id/expenses/some-id`.
8. **Invalid Enum**: Attempt to set `paymentMethod` to 'Credit Card' (not in enum).
9. **Timestamp Spoofing**: Attempt to set `updatedAt` to a past date instead of server time.
10. **ID Poisoning**: Attempt to use `../poison/..` as a document ID.
11. **Blanket Read**: Attempt a collection group query on `expenses` without a user filter.
12. **Immutable Field Change**: Attempt to change `userId` inside a user document after creation.

## The Test Runner (firestore.rules.test.ts)
```typescript
// This file demonstrates the intended security verification logic.
// In a real environment, these tests would be executed using the Firebase Emulator Suite.

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

// Mocks and test setup would go here...
```

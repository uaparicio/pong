## Step 1: Initial Project Setup
- Initial folder structure and basic files created.
- Branch `setup_initial_structure` used for initial setup.
- First commit to the main branch with the basic project structure.

## Step 2: Backend Initial Setup
- Created virtual environment in `backend` and installed initial dependencies (Flask, Pyrebase).
- Added `app.py` and `config.py` for Flask server entry point and Firebase configuration.

## Step 3: Flask Server Setup
- Created Flask server in `app.py` and connected to Firebase.
- Verified server setup with a test route at the root URL.

## Step 4: Firebase Authentication Setup
- Added routes for user registration (`/register`) and login (`/login`) with Firebase Authentication.
- Verified both routes using Postman to ensure successful responses and error handling.

## Step 5: Firebase Database and Access Setup
- Configured Firebase Firestore database with collections for `users`, `teams`, `matches`, and `logs`.
- Added Firebase credentials in `config.py` and `firebase_credentials.json` for secure access.

## Step 6: Firestore Connection Setup
- Configured Firebase Admin SDK to connect to Firestore.
- Added `/test-firestore` route to verify Firestore connection with a sample document.

## Step 7: User Registration in Firestore
- Updated `/register` endpoint to store user data in Firestore.
- Verified successful registration and data storage in the `users` collection.

## Step 8: User Login with Firestore Verification
- Updated `/login` endpoint to authenticate users and verify data existence in Firestore.
- Verified successful login and data retrieval from `users` collection in Firestore.

## Step 9: Roles and Permissions
- Added `role` field to user data in Firestore for role-based access control.
- Created decorator to enforce role restrictions on protected routes.
- Verified role-based access to `admin-only` route.

## Step 10: Team Management
- Added `/create-team` endpoint for admins to create teams with exactly four players.
- Verified team data is stored correctly in Firestore under the `teams` collection.

## Step 11: Match Management
- Added `/create-match` endpoint for scheduling matches between teams.
- Added `/record-result` endpoint for recording match results.
- Verified match creation and result recording in Firestore.

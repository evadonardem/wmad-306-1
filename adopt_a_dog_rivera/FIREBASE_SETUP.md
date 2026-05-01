# Firebase Setup Guide - Adopt-a-Dog App

## ✅ Completed Setup Steps

1. **Firebase Dependencies Added**
   - firebase_core: ^2.31.0
   - firebase_auth: ^4.20.0
   - cloud_firestore: ^4.17.0

2. **Firebase Initialization**
   - main.dart configured to initialize Firebase on app startup
   - Firebase options file created (lib/firebase_options.dart)

3. **Backend Services Created**
   - `lib/services/firebase_auth_service.dart` - Authentication management
   - `lib/services/firestore_service.dart` - Database operations

## 🔧 NEXT STEPS - Complete Firebase Configuration

### Step 1: Update Firebase Configuration
You need to get your actual Firebase credentials and update `lib/firebase_options.dart`:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fureverhome-80125**
3. For each platform (Web, Android, iOS, etc.), get the following:
   - API Key
   - App ID
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - Measurement ID (for web)

4. Update the corresponding platform configuration in `firebase_options.dart`

### Step 2: Firebase Console Configuration

#### Enable Authentication
1. Go to Firebase Console → Authentication
2. Enable these sign-in methods:
   - Email/Password
   - Google Sign-in (optional, for future)

#### Create Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database in **production mode**
3. Choose your region (recommended: `us-central1`)

#### Set Firestore Security Rules
Replace default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }
    
    // Dogs collection (public read, shelter write)
    match /dogs/{dogId} {
      allow read: if true;
      allow create: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'shelter';
      allow update: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['shelter', 'admin'];
      allow delete: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['shelter', 'admin'];
    }
    
    // Applications collection
    match /applications/{appId} {
      allow create: if request.auth.uid != null;
      allow read: if request.auth.uid != null && 
                     (resource.data.userId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'shelter');
      allow update: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'shelter';
    }
    
    // Shelters collection
    match /shelters/{shelterId} {
      allow read: if true;
      allow create: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update: if request.auth.uid != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin'];
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow create: if request.auth.uid != null;
      allow read: if request.auth.uid != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📁 Database Schema

### Users Collection
```
{
  email: string,
  role: "adopter" | "shelter" | "admin",
  displayName: string (optional),
  photoURL: string (optional),
  favorites: array<dogId>,
  lifestyle: object (for adopters),
  address: string,
  phone: string,
  verified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Dogs Collection
```
{
  name: string,
  breed: string,
  subBreeds: array<string>,
  age: number,
  description: string,
  imageUrls: array<string>,
  shelterId: string,
  energyLevel: "low" | "medium" | "high",
  maintenanceLevel: "low" | "medium" | "high",
  healthStatus: string,
  adoptedAt: timestamp (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Applications Collection
```
{
  userId: string,
  dogId: string,
  status: "pending" | "approved" | "rejected",
  submittedAt: timestamp,
  interviewDate: timestamp (optional),
  notes: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Shelters Collection
```
{
  name: string,
  address: string,
  phone: string,
  email: string,
  verifiedStatus: boolean,
  trustScore: number,
  description: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Matches Collection
```
{
  userId: string,
  dogId: string,
  compatibilityScore: number (0-100),
  breakdown: {
    energyMatch: number,
    spaceFit: number,
    maintenanceFit: number,
    budgetFit: number
  },
  createdAt: timestamp
}
```

## 🧪 Testing the Setup

Once you've updated the Firebase configuration:

1. Run the app:
   ```bash
   flutter run -d chrome
   ```

2. The app should:
   - Initialize Firebase without errors
   - Load the existing breed list screen
   - Prepare for authentication features

## 📝 Available Services

### FirebaseAuthService
- `signUp()` - Create new user account
- `signIn()` - Login with email/password
- `signOut()` - Logout
- `updateUserProfile()` - Update display name/photo
- `sendPasswordResetEmail()` - Send password reset

### FirestoreService
- `saveUserProfile()` - Save user data
- `saveDogProfile()` - Add dog listing
- `saveAdoptionApplication()` - Submit adoption request
- `addFavorite() / removeFavorite()` - Manage favorites
- `saveShelterProfile()` - Create shelter account
- `saveMatch()` - Store AI match results

## ⚠️ Important Notes

1. **Firebase Credentials**: Never commit actual API keys to GitHub. Use environment variables in production.
2. **Security Rules**: Start with strict rules and relax as needed based on your requirements.
3. **Testing**: Use Firebase Emulator Suite for local development (optional).

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [FlutterFire Documentation](https://firebase.flutter.dev/)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)

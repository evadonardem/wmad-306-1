import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Service for managing user authentication with Firebase Auth
class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Get current authenticated user
  static User? get currentUser => _auth.currentUser;

  /// Stream of auth state changes
  static Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Get user ID of currently authenticated user
  static String? get currentUserId => _auth.currentUser?.uid;

  /// Sign up with email and password
  /// [email] - User's email
  /// [password] - User's password
  /// [displayName] - User's display name
  /// [role] - User role ('adopter' or 'shelter')
  /// Returns: UserCredential on success, throws FirebaseAuthException on error
  static Future<UserCredential> signUpWithEmail({
    required String email,
    required String password,
    required String displayName,
    required String role,
  }) async {
    try {
      final UserCredential userCredential =
          await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await userCredential.user!.updateDisplayName(displayName);

      // Create user profile in Firestore
      print('AuthService: Creating user profile for ${userCredential.user!.uid} with role: $role');
      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'uid': userCredential.user!.uid,
        'email': email,
        'displayName': displayName,
        'role': role, // 'adopter' or 'shelter'
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'profileComplete': false,
        'isActive': true,
      });
      print('AuthService: User profile created successfully');

      return userCredential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  /// Sign in with email and password
  /// [email] - User's email
  /// [password] - User's password
  /// Returns: UserCredential on success, throws FirebaseAuthException on error
  static Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  /// Send password reset email
  /// [email] - User's email
  /// Returns: void on success, throws FirebaseAuthException on error
  static Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  /// Sign out current user
  /// Returns: void on success, throws exception on error
  static Future<void> signOut() async {
    try {
      await _auth.signOut();
    } catch (e) {
      throw Exception('Failed to sign out: $e');
    }
  }

  /// Update user profile
  /// [displayName] - New display name (optional)
  /// [photoUrl] - New photo URL (optional)
  static Future<void> updateUserProfile({
    String? displayName,
    String? photoUrl,
  }) async {
    try {
      final user = _auth.currentUser;
      if (user == null) throw Exception('No authenticated user');

      await user.updateDisplayName(displayName ?? user.displayName);
      if (photoUrl != null) {
        await user.updatePhotoURL(photoUrl);
      }

      // Update Firestore
      await _firestore.collection('users').doc(user.uid).update({
        'displayName': displayName ?? user.displayName,
        'photoUrl': photoUrl,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Failed to update profile: $e');
    }
  }

  /// Get user role from Firestore
  /// Returns: 'adopter', 'shelter', or null if not found
  static Future<String?> getUserRole(String uid) async {
    try {
      print('AuthService: Fetching user role for uid: $uid');
      final doc = await _firestore.collection('users').doc(uid).get();
      print('AuthService: Document exists: ${doc.exists}');
      if (doc.exists) {
        final data = doc.data();
        print('AuthService: Document data: $data');
        final role = data?['role'] as String?;
        print('AuthService: Retrieved role: $role');
        return role;
      } else {
        print('AuthService: Document does not exist');
        return null;
      }
    } catch (e) {
      print('AuthService: Error getting user role: $e');
      throw Exception('Failed to get user role: $e');
    }
  }

  /// Get user profile from Firestore
  /// Returns: Map of user data or null if not found
  static Future<Map<String, dynamic>?> getUserProfile(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      return doc.data();
    } catch (e) {
      throw Exception('Failed to get user profile: $e');
    }
  }

  /// Check if user profile is complete
  /// Returns: true if profileComplete is true, false otherwise
  static Future<bool> isProfileComplete(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      return doc.data()?['profileComplete'] as bool? ?? false;
    } catch (e) {
      throw Exception('Failed to check profile completion: $e');
    }
  }

  /// Mark user profile as complete
  /// [uid] - User ID
  static Future<void> markProfileComplete(String uid) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        'profileComplete': true,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Failed to mark profile complete: $e');
    }
  }

  /// Update user profile completion status and any other profile data
  /// [uid] - User ID
  /// [profileData] - Map of profile data to update
  static Future<void> updateUserProfileData(
    String uid,
    Map<String, dynamic> profileData,
  ) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        ...profileData,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('Failed to update user profile data: $e');
    }
  }

  /// Delete user account and associated data
  /// [uid] - User ID to delete
  static Future<void> deleteAccount(String uid) async {
    try {
      // Delete user document from Firestore
      await _firestore.collection('users').doc(uid).delete();

      // Delete user from Firebase Auth
      await _auth.currentUser?.delete();
    } catch (e) {
      throw Exception('Failed to delete account: $e');
    }
  }

  /// Handle Firebase Auth exceptions with user-friendly messages
  static Exception _handleAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-email':
        return Exception('Invalid email address');
      case 'user-disabled':
        return Exception('User account has been disabled');
      case 'user-not-found':
        return Exception('User not found. Please check your email');
      case 'wrong-password':
        return Exception('Incorrect password');
      case 'email-already-in-use':
        return Exception('Email is already in use. Please sign in instead');
      case 'operation-not-allowed':
        return Exception('Email/password sign up is not enabled');
      case 'weak-password':
        return Exception('Password is too weak. Use at least 6 characters');
      case 'too-many-requests':
        return Exception('Too many login attempts. Please try again later');
      default:
        return Exception('Authentication error: ${e.message}');
    }
  }
}

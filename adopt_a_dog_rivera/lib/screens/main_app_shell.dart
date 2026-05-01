import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'signup_screen.dart';
import 'password_reset_screen.dart';
import 'adopter_home_screen.dart';
import 'shelter_home_screen.dart';

/// Main app shell that handles authentication state and role-based navigation
/// Shows login/signup if not authenticated, different home screens based on role
class MainAppShell extends StatefulWidget {
  const MainAppShell({super.key});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  late Stream<User?> _authStateStream;
  String? _userRole;
  String? _currentUserUid;
  final _unauthNavigatorKey = GlobalKey<NavigatorState>();

  @override
  void initState() {
    super.initState();
    _authStateStream = AuthService.authStateChanges;
  }

  /// Get user role for authenticated user
  Future<String?> _getUserRole(String uid) async {
    try {
      print('MainAppShell: Getting role for user: $uid');
      final role = await AuthService.getUserRole(uid);
      print('MainAppShell: User role retrieved: $role');
      return role;
    } catch (e) {
      print('MainAppShell: Error getting user role: $e');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _authStateStream,
      builder: (context, snapshot) {
        print('MainAppShell: Auth state changed - hasData: ${snapshot.hasData}, user: ${snapshot.data?.email}');
        
        // Loading state
        if (snapshot.connectionState == ConnectionState.waiting) {
          print('MainAppShell: Waiting for auth state');
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(
                color: Color(0xFF7C51C2),
              ),
            ),
          );
        }

        // Not authenticated - show auth screens
        if (!snapshot.hasData || snapshot.data == null) {
          print('MainAppShell: No user authenticated, showing login screen');
          return _buildUnauthenticatedApp();
        }

        // Authenticated - show role-based home screen
        final user = snapshot.data!;
        print('MainAppShell: User authenticated: ${user.email}, fetching role...');
        
        // Only fetch role if user ID changed
        if (_currentUserUid != user.uid) {
          _currentUserUid = user.uid;
          _userRole = null; // Reset role for new user
        }
        
        return FutureBuilder<String?>(
          future: _userRole != null ? Future.value(_userRole) : _getUserRole(user.uid),
          builder: (context, roleSnapshot) {
            print('MainAppShell: Role fetch state - connectionState: ${roleSnapshot.connectionState}, role: ${roleSnapshot.data}');
            
            if (roleSnapshot.connectionState == ConnectionState.waiting) {
              return const Scaffold(
                body: Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFF7C51C2),
                  ),
                ),
              );
            }

            final role = roleSnapshot.data;
            if (role != null && _userRole == null) {
              _userRole = role; // Cache the role
            }

            if (role == null) {
              print('MainAppShell: Role is null, but proceeding with default role for testing');
              // For testing, default to adopter role if role is null
              _userRole = 'adopter';
              return AdopterHomeScreen(user: user);
            }
            
            print('MainAppShell: Showing home screen for role: $role');

            // Show appropriate home screen based on role
            if (role == 'adopter') {
              return AdopterHomeScreen(user: user);
            } else if (role == 'shelter') {
              return ShelterHomeScreen(user: user);
            } else {
              return _buildErrorScreen();
            }
          },
        );
      },
    );
  }

  /// Build unauthenticated app with login/signup navigation
  Widget _buildUnauthenticatedApp() {
    return Navigator(
      key: _unauthNavigatorKey,
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/signup':
            return MaterialPageRoute(
              builder: (_) => SignupScreen(
                onLoginTap: () {
                  _unauthNavigatorKey.currentState?.pushNamed('/login');
                },
              ),
            );
          case '/forgot-password':
            return MaterialPageRoute(
              builder: (_) => const PasswordResetScreen(),
            );
          default:
            return MaterialPageRoute(
              builder: (_) => LoginScreen(
                onSignUpTap: () {
                  _unauthNavigatorKey.currentState?.pushNamed('/signup');
                },
                onForgotPasswordTap: () {
                  _unauthNavigatorKey.currentState?.pushNamed('/forgot-password');
                },
              ),
            );
        }
      },
    );
  }

  /// Build error screen
  Widget _buildErrorScreen() {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 48,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            const Text(
              'Error Loading Profile',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Unable to determine user role. Please try again.',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () async {
                await AuthService.signOut();
                setState(() {});
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C51C2),
              ),
              child: const Text(
                'Sign Out',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

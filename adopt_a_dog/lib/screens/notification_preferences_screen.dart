import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/notification_service.dart';

/// Screen for managing notification preferences
/// Allows users to toggle which notifications they want to receive
class NotificationPreferencesScreen extends StatefulWidget {
  const NotificationPreferencesScreen({super.key});

  @override
  State<NotificationPreferencesScreen> createState() =>
      _NotificationPreferencesScreenState();
}

class _NotificationPreferencesScreenState
    extends State<NotificationPreferencesScreen> {
  late NotificationPreferences _preferences;
  bool _isLoading = true;
  bool _isSaving = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  /// Load notification preferences from Firestore
  Future<void> _loadPreferences() async {
    setState(() => _isLoading = true);

    try {
      final userId = FirebaseAuth.instance.currentUser?.uid;
      if (userId == null) throw Exception('User not authenticated');

      final prefs = await NotificationService.getNotificationPreferences(userId);

      setState(() {
        _preferences = prefs != null
            ? NotificationPreferences.fromMap(prefs)
            : const NotificationPreferences();
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load preferences: $e';
        _isLoading = false;
      });
    }
  }

  /// Save notification preferences to Firestore
  Future<void> _savePreferences() async {
    setState(() => _isSaving = true);

    try {
      final userId = FirebaseAuth.instance.currentUser?.uid;
      if (userId == null) throw Exception('User not authenticated');

      await NotificationService.saveNotificationPreferences(
        userId,
        _preferences.toMap(),
      );

      setState(() => _isSaving = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Preferences saved successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isSaving = false;
        _errorMessage = 'Failed to save preferences: $e';
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Preferences'),
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF7C51C2)),
            )
          : SingleChildScrollView(
              child: Column(
                children: [
                  // Error Message
                  if (_errorMessage != null)
                    Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.red.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Colors.red),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _errorMessage!.replaceFirst('Exception: ', ''),
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                        ],
                      ),
                    ),
                  // Preferences List
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        const Text(
                          'Email Notifications',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Choose which notifications you\'d like to receive',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Application Approved
                        _PreferenceToggle(
                          title: 'Application Approved',
                          description: 'When your adoption application is approved',
                          value: _preferences.applicationApproved,
                          onChanged: (value) {
                            setState(() {
                              _preferences = NotificationPreferences(
                                applicationApproved: value,
                                applicationRejected:
                                    _preferences.applicationRejected,
                                newMatch: _preferences.newMatch,
                                shelterUpdated: _preferences.shelterUpdated,
                                dogAvailable: _preferences.dogAvailable,
                              );
                            });
                          },
                        ),
                        const SizedBox(height: 12),
                        // Application Rejected
                        _PreferenceToggle(
                          title: 'Application Rejected',
                          description:
                              'When your adoption application is rejected',
                          value: _preferences.applicationRejected,
                          onChanged: (value) {
                            setState(() {
                              _preferences = NotificationPreferences(
                                applicationApproved:
                                    _preferences.applicationApproved,
                                applicationRejected: value,
                                newMatch: _preferences.newMatch,
                                shelterUpdated: _preferences.shelterUpdated,
                                dogAvailable: _preferences.dogAvailable,
                              );
                            });
                          },
                        ),
                        const SizedBox(height: 12),
                        // New Match
                        _PreferenceToggle(
                          title: 'New Match Found',
                          description:
                              'When a dog matches your preferences (adopters only)',
                          value: _preferences.newMatch,
                          onChanged: (value) {
                            setState(() {
                              _preferences = NotificationPreferences(
                                applicationApproved:
                                    _preferences.applicationApproved,
                                applicationRejected:
                                    _preferences.applicationRejected,
                                newMatch: value,
                                shelterUpdated: _preferences.shelterUpdated,
                                dogAvailable: _preferences.dogAvailable,
                              );
                            });
                          },
                        ),
                        const SizedBox(height: 12),
                        // Dog Available
                        _PreferenceToggle(
                          title: 'Dog Available',
                          description: 'When a dog you\'re interested in becomes available',
                          value: _preferences.dogAvailable,
                          onChanged: (value) {
                            setState(() {
                              _preferences = NotificationPreferences(
                                applicationApproved:
                                    _preferences.applicationApproved,
                                applicationRejected:
                                    _preferences.applicationRejected,
                                newMatch: _preferences.newMatch,
                                shelterUpdated: _preferences.shelterUpdated,
                                dogAvailable: value,
                              );
                            });
                          },
                        ),
                        const SizedBox(height: 12),
                        // Shelter Updated
                        _PreferenceToggle(
                          title: 'Shelter Updates',
                          description:
                              'Receive announcements from shelters (shelter staff only)',
                          value: _preferences.shelterUpdated,
                          onChanged: (value) {
                            setState(() {
                              _preferences = NotificationPreferences(
                                applicationApproved:
                                    _preferences.applicationApproved,
                                applicationRejected:
                                    _preferences.applicationRejected,
                                newMatch: _preferences.newMatch,
                                shelterUpdated: value,
                                dogAvailable: _preferences.dogAvailable,
                              );
                            });
                          },
                        ),
                        const SizedBox(height: 32),
                        // Save Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: _isSaving ? null : _savePreferences,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF7C51C2),
                              disabledBackgroundColor: Colors.grey[400],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: _isSaving
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Text(
                                    'Save Preferences',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

/// Widget for displaying a notification preference toggle
class _PreferenceToggle extends StatelessWidget {
  final String title;
  final String description;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _PreferenceToggle({
    required this.title,
    required this.description,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: const Color(0xFF7C51C2),
          ),
        ],
      ),
    );
  }
}

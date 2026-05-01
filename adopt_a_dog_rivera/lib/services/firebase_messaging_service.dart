import 'package:firebase_messaging/firebase_messaging.dart';
import 'dart:async';

class FirebaseMessagingService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  // Stream controllers for notification events
  final _notificationController = StreamController<Map<String, dynamic>>();

  Stream<Map<String, dynamic>> get notifications => _notificationController.stream;

  /// Initialize Firebase Messaging
  Future<void> initializeMessaging() async {
    try {
      // Request user permission for notifications
      final settings = await _messaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      // Handle foreground messages
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        if (message.notification != null) {
          _notificationController.add({
            'title': message.notification!.title,
            'body': message.notification!.body,
            'data': message.data,
            'type': 'foreground',
          });
        }
      });

      // Handle background message notifications (when app is opened from notification)
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        _notificationController.add({
          'title': message.notification?.title,
          'body': message.notification?.body,
          'data': message.data,
          'type': 'opened',
        });
      });

      // Handle terminated state message
      final initialMessage = await _messaging.getInitialMessage();
      if (initialMessage != null) {
        _notificationController.add({
          'title': initialMessage.notification?.title,
          'body': initialMessage.notification?.body,
          'data': initialMessage.data,
          'type': 'terminated',
        });
      }
    } catch (_) {
      // Error initializing Firebase Messaging, ignore in release.
    }
  }

  /// Get device FCM token
  Future<String?> getToken() async {
    try {
      return await _messaging.getToken();
    } catch (_) {
      return null;
    }
  }

  /// Subscribe to a topic for group messaging
  Future<void> subscribeToTopic(String topic) async {
    try {
      await _messaging.subscribeToTopic(topic);
    } catch (_) {
      // Ignore subscription errors.
    }
  }

  /// Unsubscribe from a topic
  Future<void> unsubscribeFromTopic(String topic) async {
    try {
      await _messaging.unsubscribeFromTopic(topic);
    } catch (_) {
      // Ignore unsubscription errors.
    }
  }

  /// Subscribe user to notifications about a specific dog
  Future<void> subscribeToDogNotifications(String dogId) async {
    await subscribeToTopic('dog_$dogId');
  }

  /// Subscribe user to application status notifications
  Future<void> subscribeToApplicationNotifications(String userId) async {
    await subscribeToTopic('application_$userId');
  }

  /// Subscribe to adoption match notifications
  Future<void> subscribeToMatchNotifications(String userId) async {
    await subscribeToTopic('match_$userId');
  }

  /// Unsubscribe from dog notifications
  Future<void> unsubscribeFromDogNotifications(String dogId) async {
    await unsubscribeFromTopic('dog_$dogId');
  }

  /// Notification types for adoption platform
  static const String notificationTypeApplicationApproved = 'application_approved';
  static const String notificationTypeApplicationRejected = 'application_rejected';
  static const String notificationTypeNewMatch = 'new_match';
  static const String notificationTypeDogAvailable = 'dog_available';
  static const String notificationTypeAdoptionScheduled = 'adoption_scheduled';
  static const String notificationTypeHealthReminder = 'health_reminder';

  /// Extract notification type from data
  String? extractNotificationType(Map<String, dynamic> data) {
    return data['notification_type'] as String?;
  }

  /// Extract dog ID from notification data
  String? extractDogId(Map<String, dynamic> data) {
    return data['dog_id'] as String?;
  }

  /// Extract user ID from notification data
  String? extractUserId(Map<String, dynamic> data) {
    return data['user_id'] as String?;
  }

  /// Extract application ID from notification data
  String? extractApplicationId(Map<String, dynamic> data) {
    return data['application_id'] as String?;
  }

  /// Dispose the notification stream controller
  void dispose() {
    _notificationController.close();
  }
}

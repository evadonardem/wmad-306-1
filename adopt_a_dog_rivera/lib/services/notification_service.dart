import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Background message handler for Firebase Cloud Messaging
/// Must be a top-level function, called when app is in background/terminated
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Handling a background message: ${message.messageId}');
  // Process notification when app is in background
}

/// Service for managing push notifications via Firebase Cloud Messaging
class NotificationService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Initialize notification service
  /// Request user permissions and set up handlers
  static Future<void> initialize() async {
    try {
      // Request notification permissions
      NotificationSettings settings = await _messaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        print('User granted notification permission');
      } else if (settings.authorizationStatus ==
          AuthorizationStatus.provisional) {
        print('User granted provisional notification permission');
      }

      // Set background message handler
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

      // Handle messages when app is in foreground
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        print('Got a message in foreground!');
        print('Message data: ${message.data}');

        if (message.notification != null) {
          print('Message title: ${message.notification!.title}');
          print('Message body: ${message.notification!.body}');
        }

        // Handle foreground notification display
        _handleForegroundNotification(message);
      });

      // Handle notification tap when app is in background
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        print('Notification clicked: ${message.messageId}');
        _handleNotificationTap(message);
      });

      // Get FCM token for this device
      String? token = await _messaging.getToken();
      print('FCM Token: $token');
    } catch (e) {
      print('Error initializing notifications: $e');
    }
  }

  /// Subscribe user to topic for notifications
  /// [topic] - Topic name (e.g., 'adopter_eva123', 'shelter_happy_paws')
  static Future<void> subscribeToTopic(String topic) async {
    try {
      await _messaging.subscribeToTopic(topic);
      print('Subscribed to topic: $topic');
    } catch (e) {
      print('Error subscribing to topic: $e');
    }
  }

  /// Unsubscribe user from topic
  /// [topic] - Topic name to unsubscribe from
  static Future<void> unsubscribeFromTopic(String topic) async {
    try {
      await _messaging.unsubscribeFromTopic(topic);
      print('Unsubscribed from topic: $topic');
    } catch (e) {
      print('Error unsubscribing from topic: $e');
    }
  }

  /// Subscribe adopter to dog notifications
  /// [adopterId] - Adopter user ID
  /// [dogId] - Dog ID to watch
  static Future<void> subscribeAdopterToDog(
    String adopterId,
    String dogId,
  ) async {
    try {
      // Subscribe to dog topic (for matches)
      await subscribeToTopic('dog_$dogId');

      // Save subscription in Firestore
      await _firestore
          .collection('users')
          .doc(adopterId)
          .update({
        'subscribedDogs': FieldValue.arrayUnion([dogId]),
      });
    } catch (e) {
      print('Error subscribing to dog: $e');
    }
  }

  /// Unsubscribe adopter from dog notifications
  /// [adopterId] - Adopter user ID
  /// [dogId] - Dog ID to unwatch
  static Future<void> unsubscribeAdopterFromDog(
    String adopterId,
    String dogId,
  ) async {
    try {
      await unsubscribeFromTopic('dog_$dogId');

      await _firestore
          .collection('users')
          .doc(adopterId)
          .update({
        'subscribedDogs': FieldValue.arrayRemove([dogId]),
      });
    } catch (e) {
      print('Error unsubscribing from dog: $e');
    }
  }

  /// Subscribe user to notifications for their own applications
  /// [userId] - User ID
  static Future<void> subscribeToOwnApplications(String userId) async {
    try {
      // Subscribe adopter to their own applications
      await subscribeToTopic('adopter_applications_$userId');

      // Subscribe shelter to applications for dogs they own
      await subscribeToTopic('shelter_applications_$userId');
    } catch (e) {
      print('Error subscribing to applications: $e');
    }
  }

  /// Handle notification when app is in foreground
  /// [message] - Remote message from FCM
  static void _handleForegroundNotification(RemoteMessage message) {
    // App is in foreground, handle notification display
    // In a real app, you might show a local notification
    print('Foreground notification: ${message.notification?.title}');
  }

  /// Handle notification tap/click
  /// [message] - Remote message that was tapped
  static void _handleNotificationTap(RemoteMessage message) {
    // Navigate to relevant screen based on notification type
    final data = message.data;
    final type = data['type'];

    switch (type) {
      case 'application_approved':
        // Navigate to application tracking screen
        print('Application approved: ${data['applicationId']}');
        break;
      case 'application_rejected':
        // Navigate to application tracking screen
        print('Application rejected: ${data['applicationId']}');
        break;
      case 'new_match':
        // Navigate to recommendations screen
        print('New match found: ${data['dogId']}');
        break;
      case 'dog_available':
        // Navigate to dog profile
        print('Dog available: ${data['dogId']}');
        break;
      default:
        print('Unknown notification type: $type');
    }
  }

  /// Get FCM token for current device
  /// Returns: FCM token string
  static Future<String?> getDeviceToken() async {
    try {
      final token = await _messaging.getToken();
      return token;
    } catch (e) {
      print('Error getting device token: $e');
      return null;
    }
  }

  /// Note: Notification enable/disable handled by user preference toggles
  /// No need for system-level notification control on web

  /// Save user notification preferences to Firestore
  /// [userId] - User ID
  /// [preferences] - Map of notification preferences
  /// Example: {'emailOnApproved': true, 'emailOnRejected': false, ...}
  static Future<void> saveNotificationPreferences(
    String userId,
    Map<String, bool> preferences,
  ) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .update({
        'notificationPreferences': preferences,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error saving notification preferences: $e');
    }
  }

  /// Get user notification preferences from Firestore
  /// [userId] - User ID
  /// Returns: Map of notification preferences
  static Future<Map<String, dynamic>?> getNotificationPreferences(
    String userId,
  ) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      return doc.data()?['notificationPreferences'];
    } catch (e) {
      print('Error getting notification preferences: $e');
      return null;
    }
  }
}

/// Model for notification preferences
class NotificationPreferences {
  final bool applicationApproved;
  final bool applicationRejected;
  final bool newMatch;
  final bool shelterUpdated;
  final bool dogAvailable;

  const NotificationPreferences({
    this.applicationApproved = true,
    this.applicationRejected = true,
    this.newMatch = true,
    this.shelterUpdated = false,
    this.dogAvailable = true,
  });

  Map<String, bool> toMap() {
    return {
      'applicationApproved': applicationApproved,
      'applicationRejected': applicationRejected,
      'newMatch': newMatch,
      'shelterUpdated': shelterUpdated,
      'dogAvailable': dogAvailable,
    };
  }

  factory NotificationPreferences.fromMap(Map<String, dynamic> map) {
    return NotificationPreferences(
      applicationApproved: map['applicationApproved'] ?? true,
      applicationRejected: map['applicationRejected'] ?? true,
      newMatch: map['newMatch'] ?? true,
      shelterUpdated: map['shelterUpdated'] ?? false,
      dogAvailable: map['dogAvailable'] ?? true,
    );
  }
}

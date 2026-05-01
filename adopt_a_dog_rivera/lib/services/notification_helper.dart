import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

/// Helper service for sending notifications through Firebase Cloud Messaging
/// This service encapsulates the logic for triggering notifications
/// based on adoption-related events
class NotificationHelper {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  /// Send notification when adoption application is approved
  /// [adopterId] - ID of the adopter whose application was approved
  /// [dogId] - ID of the dog being adopted
  /// [dogName] - Name of the dog
  /// [applicationId] - ID of the application
  static Future<void> sendApplicationApprovedNotification({
    required String adopterId,
    required String dogId,
    required String dogName,
    required String applicationId,
  }) async {
    try {
      // Check if user has this notification enabled
      final prefs =
          await _firestore.collection('users').doc(adopterId).get();
      final notifPrefs =
          prefs.data()?['notificationPreferences'] as Map<String, dynamic>?;

      if (notifPrefs?['applicationApproved'] != false) {
        // Send via topic to adopter
        await _sendTopicNotification(
          topic: 'adopter_applications_$adopterId',
          title: 'Application Approved! 🎉',
          body: 'Congratulations! Your application for $dogName has been approved!',
          data: {
            'type': 'application_approved',
            'applicationId': applicationId,
            'dogId': dogId,
          },
        );
      }
    } catch (e) {
      print('Error sending approval notification: $e');
    }
  }

  /// Send notification when adoption application is rejected
  /// [adopterId] - ID of the adopter whose application was rejected
  /// [dogName] - Name of the dog
  /// [applicationId] - ID of the application
  /// [rejectionReason] - Reason for rejection (optional)
  static Future<void> sendApplicationRejectedNotification({
    required String adopterId,
    required String dogName,
    required String applicationId,
    String? rejectionReason,
  }) async {
    try {
      // Check if user has this notification enabled
      final prefs =
          await _firestore.collection('users').doc(adopterId).get();
      final notifPrefs =
          prefs.data()?['notificationPreferences'] as Map<String, dynamic>?;

      if (notifPrefs?['applicationRejected'] != false) {
        final body = rejectionReason != null
            ? 'Your application for $dogName was not approved. Reason: $rejectionReason'
            : 'Your application for $dogName was not approved.';

        await _sendTopicNotification(
          topic: 'adopter_applications_$adopterId',
          title: 'Application Update',
          body: body,
          data: {
            'type': 'application_rejected',
            'applicationId': applicationId,
          },
        );
      }
    } catch (e) {
      print('Error sending rejection notification: $e');
    }
  }

  /// Send notification for new dog match found
  /// [adopterId] - ID of the adopter who has a match
  /// [dogId] - ID of the matched dog
  /// [dogName] - Name of the dog
  /// [compatibilityScore] - Compatibility score (0-100)
  static Future<void> sendNewMatchNotification({
    required String adopterId,
    required String dogId,
    required String dogName,
    required int compatibilityScore,
  }) async {
    try {
      // Check if user has this notification enabled
      final prefs =
          await _firestore.collection('users').doc(adopterId).get();
      final notifPrefs =
          prefs.data()?['notificationPreferences'] as Map<String, dynamic>?;

      if (notifPrefs?['newMatch'] != false) {
        final scoreLabel = _getScoreLabel(compatibilityScore);

        await _sendTopicNotification(
          topic: 'adopter_applications_$adopterId',
          title: 'New Match Found! ⭐',
          body:
              'We found a $scoreLabel match: $dogName ($compatibilityScore% compatible)',
          data: {
            'type': 'new_match',
            'dogId': dogId,
            'score': compatibilityScore.toString(),
          },
        );
      }
    } catch (e) {
      print('Error sending match notification: $e');
    }
  }

  /// Send notification when a dog becomes available
  /// [subscriberIds] - List of adopter IDs to notify
  /// [dogId] - ID of the dog
  /// [dogName] - Name of the dog
  /// [dogBreed] - Breed of the dog
  static Future<void> sendDogAvailableNotification({
    required List<String> subscriberIds,
    required String dogId,
    required String dogName,
    required String dogBreed,
  }) async {
    try {
      for (final adopterId in subscriberIds) {
        // Check if user has this notification enabled
        final prefs =
            await _firestore.collection('users').doc(adopterId).get();
        final notifPrefs =
            prefs.data()?['notificationPreferences'] as Map<String, dynamic>?;

        if (notifPrefs?['dogAvailable'] != false) {
          await _sendTopicNotification(
            topic: 'adopter_applications_$adopterId',
            title: 'Dog Available! 🐕',
            body: '$dogName ($dogBreed) is now available for adoption!',
            data: {
              'type': 'dog_available',
              'dogId': dogId,
            },
          );
        }
      }
    } catch (e) {
      print('Error sending dog available notification: $e');
    }
  }

  /// Send notification when a dog is adopted
  /// [shelterId] - ID of the shelter
  /// [dogName] - Name of the dog
  /// [dogId] - ID of the dog
  static Future<void> sendDogAdoptedNotification({
    required String shelterId,
    required String dogName,
    required String dogId,
  }) async {
    try {
      await _sendTopicNotification(
        topic: 'shelter_$shelterId',
        title: 'Dog Adopted! 🎉',
        body: '$dogName has been adopted!',
        data: {
          'type': 'dog_adopted',
          'dogId': dogId,
        },
      );
    } catch (e) {
      print('Error sending adoption notification: $e');
    }
  }

  /// Send topic-based notification via Firebase Cloud Messaging
  /// [topic] - Topic to send notification to
  /// [title] - Notification title
  /// [body] - Notification body
  /// [data] - Custom data payload
  static Future<void> _sendTopicNotification({
    required String topic,
    required String title,
    required String body,
    required Map<String, String> data,
  }) async {
    try {
      // Note: This would typically be called from a Firebase Cloud Function
      // For now, we're documenting the structure
      // Cloud Function would use:
      // admin.messaging().send({
      //   notification: { title, body },
      //   webpush: { data },
      //   topic,
      // });
      print('Notification queued for topic: $topic');
      print('Title: $title');
      print('Body: $body');
    } catch (e) {
      print('Error sending notification: $e');
    }
  }

  /// Get human-readable score label from compatibility score
  static String _getScoreLabel(int score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Possible';
  }
}

import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';

class FirebaseStorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Upload dog image to Firebase Storage
  Future<String> uploadDogImage({
    required String dogId,
    required File imageFile,
  }) async {
    try {
      final fileName = '${DateTime.now().millisecondsSinceEpoch}_${imageFile.path.split('/').last}';
      final ref = _storage.ref('dogs/$dogId/$fileName');
      
      await ref.putFile(imageFile);
      final downloadUrl = await ref.getDownloadURL();
      
      return downloadUrl;
    } catch (e) {
      throw Exception('Error uploading dog image: $e');
    }
  }

  /// Upload dog images in batch
  Future<List<String>> uploadDogImages({
    required String dogId,
    required List<File> imageFiles,
  }) async {
    try {
      final downloadUrls = <String>[];
      
      for (final imageFile in imageFiles) {
        final url = await uploadDogImage(dogId: dogId, imageFile: imageFile);
        downloadUrls.add(url);
      }
      
      return downloadUrls;
    } catch (e) {
      throw Exception('Error uploading dog images: $e');
    }
  }

  /// Upload adoption application document (PDF, etc.)
  Future<String> uploadApplicationDocument({
    required String userId,
    required String applicationId,
    required File documentFile,
  }) async {
    try {
      final fileName = documentFile.path.split('/').last;
      final ref = _storage.ref('applications/$userId/$applicationId/$fileName');
      
      await ref.putFile(documentFile);
      final downloadUrl = await ref.getDownloadURL();
      
      return downloadUrl;
    } catch (e) {
      throw Exception('Error uploading application document: $e');
    }
  }

  /// Upload user profile photo
  Future<String> uploadProfilePhoto({
    required String userId,
    required File photoFile,
  }) async {
    try {
      final fileName = '${DateTime.now().millisecondsSinceEpoch}_profile.jpg';
      final ref = _storage.ref('profiles/$userId/$fileName');
      
      await ref.putFile(photoFile);
      final downloadUrl = await ref.getDownloadURL();
      
      return downloadUrl;
    } catch (e) {
      throw Exception('Error uploading profile photo: $e');
    }
  }

  /// Delete file from Firebase Storage
  Future<void> deleteFile(String filePath) async {
    try {
      final ref = _storage.ref(filePath);
      await ref.delete();
    } catch (e) {
      throw Exception('Error deleting file: $e');
    }
  }

  /// Delete all files in a directory
  Future<void> deleteDirectory(String directoryPath) async {
    try {
      final ref = _storage.ref(directoryPath);
      final items = await ref.listAll();
      
      for (final item in items.items) {
        await item.delete();
      }
      
      for (final prefix in items.prefixes) {
        await deleteDirectory(prefix.fullPath);
      }
    } catch (e) {
      throw Exception('Error deleting directory: $e');
    }
  }

  /// Get download URL for a file
  Future<String> getDownloadUrl(String filePath) async {
    try {
      final ref = _storage.ref(filePath);
      return await ref.getDownloadURL();
    } catch (e) {
      throw Exception('Error getting download URL: $e');
    }
  }

  /// List all files in a directory
  Future<List<String>> listFiles(String directoryPath) async {
    try {
      final ref = _storage.ref(directoryPath);
      final items = await ref.listAll();
      
      final urls = <String>[];
      for (final item in items.items) {
        final url = await item.getDownloadURL();
        urls.add(url);
      }
      
      return urls;
    } catch (e) {
      throw Exception('Error listing files: $e');
    }
  }

  /// Get file metadata
  Future<FullMetadata?> getFileMetadata(String filePath) async {
    try {
      final ref = _storage.ref(filePath);
      return await ref.getMetadata();
    } catch (e) {
      throw Exception('Error getting file metadata: $e');
    }
  }
}

import 'dart:math';

class LikesService {
  const LikesService._();

  // Generates a pseudo-random like count tied to image URL so values stay stable.
  static int likesForImage(String imageUrl) {
    var seed = 0;
    for (final code in imageUrl.codeUnits) {
      seed = (seed * 31 + code) & 0x7fffffff;
    }
    final random = Random(seed);
    return 200 + random.nextInt(9801);
  }

  // Generates a stable community-like count for a breed name.
  static int likesForBreed(String breedName) {
    var seed = 0;
    for (final code in breedName.codeUnits) {
      seed = (seed * 37 + code) & 0x7fffffff;
    }
    final random = Random(seed);
    return 1200 + random.nextInt(86801);
  }

  static String formatLikes(int likes) {
    final value = likes.toString();
    final buffer = StringBuffer();

    for (var i = 0; i < value.length; i++) {
      final remaining = value.length - i;
      buffer.write(value[i]);
      if (remaining > 1 && remaining % 3 == 1) {
        buffer.write(',');
      }
    }

    return buffer.toString();
  }
}

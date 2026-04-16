class HeroImageService {
  static String? _apiToken;

  static void initialize(String token) {
    _apiToken = token;
  }

  static String getImageUrl(String heroId) {
    if (_apiToken == null) {
      return '';
    }
    // Use the official API image endpoint
    return 'https://superheroapi.com/api/$_apiToken/images/$heroId.jpg';
  }

  static String getFallbackImageUrl(String heroName) {
    // Fallback to UI Avatars if API image fails
    final encodedName = Uri.encodeComponent(heroName);
    return 'https://ui-avatars.com/api/?name=$encodedName&background=1D4ED8&color=fff&size=400&rounded=true&bold=true';
  }
}
import 'dart:convert';
import 'dart:math';

import 'package:http/http.dart' as http;

import '../models/dog.dart';

/// PawMatch ApiService.
///
/// **Why Dog CEO?** TheDogAPI now requires an API key for all requests
/// (returns 403 without one). Petfinder needs OAuth registration. Dog CEO
/// (https://dog.ceo/dog-api) is free, key-less, and CORS-friendly — perfect
/// for a runnable demo. It only returns images though, so we layer
/// adoption-style metadata (name, age, weight, bio, location, traits) on top
/// using a deterministic seeded RNG keyed on the photo URL: the same dog
/// gets the same data on every load, even across app restarts.
///
/// To swap in a real adoption back-end, replace the bodies of [fetchDogs] /
/// [fetchDog] / [submitAdoptionInquiry] — public signatures match the spec
/// (`GET /api/dogs`, `GET /api/dogs/{id}`, `POST /api/adopt`).
class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  static const String _base = 'https://dog.ceo/api';
  static const int _galleryCount = 30;

  // ─── Filter categories ─────────────────────────────────────────────────────

  /// Mirrors `GET /api/filters`. Static catalogue mapped to client-side
  /// predicates inside DogsProvider.
  Future<List<String>> fetchFilters() async {
    await Future<void>.delayed(const Duration(milliseconds: 120));
    return const [
      'Small',
      'Medium',
      'Large',
      'Senior',
      'Puppy',
      'Calm',
      'Energetic',
      'Good with kids',
    ];
  }

  // ─── Gallery ───────────────────────────────────────────────────────────────

  /// `GET /api/dogs` — list of dog summaries.
  ///
  /// Pulls a batch of random images from Dog CEO (one HTTP call) and turns
  /// each into one adoption profile. Image URLs encode the breed in their
  /// path (e.g. `images.dog.ceo/breeds/hound-afghan/...`), so we can derive
  /// breed/sub-breed from the URL alone — no per-breed round-trips needed.
  Future<List<DogSummary>> fetchDogs() async {
    final uri = Uri.parse('$_base/breeds/image/random/$_galleryCount');
    final res = await _client.get(uri);

    if (res.statusCode != 200) {
      throw ApiException('Failed to load dogs (${res.statusCode})');
    }

    final Map<String, dynamic> body =
        jsonDecode(res.body) as Map<String, dynamic>;
    if (body['status'] != 'success') {
      throw ApiException('Dog CEO returned status ${body['status']}');
    }

    final List<dynamic> urls = body['message'] as List<dynamic>;

    // De-duplicate by URL — the random endpoint occasionally repeats.
    final seen = <String>{};
    final summaries = <DogSummary>[];
    for (final dynamic raw in urls) {
      final url = raw as String;
      if (!seen.add(url)) continue;
      final s = _summaryFromUrl(url);
      if (s != null) summaries.add(s);
    }
    return summaries;
  }

  /// `GET /api/dogs/{id}` — full record for a single dog.
  ///
  /// `id` is the photo URL (used as a stable handle). We re-derive the breed
  /// from it and pull a few extra photos for the carousel.
  Future<Dog> fetchDog(String id) async {
    final summary = _summaryFromUrl(id);
    if (summary == null) {
      throw ApiException('Bad dog id: $id');
    }

    final breedPath = _breedPathFromUrl(id);
    List<String> photos = <String>[id];
    if (breedPath != null) {
      try {
        final extras = await _fetchBreedPhotos(breedPath, count: 5);
        photos = <String>[id, ...extras.where((p) => p != id)];
      } catch (_) {
        // Carousel-only — fall back to the hero image if the secondary call
        // fails (rate limit, transient error, etc.).
      }
    }

    final rng = seededRandom(id);
    return Dog(
      id: summary.id,
      name: summary.name,
      age: summary.age,
      size: summary.size,
      weight: _weightFromSize(summary.size, rng),
      breed: summary.breed,
      bio: _generateBio(summary),
      fullPhotos: photos,
      location: _pickLocation(rng),
      goodWithKids: rng.nextDouble() > 0.25,
      goodWithDogs: rng.nextDouble() > 0.3,
      energyLevel: _energyFromTrait(summary.primaryTrait, rng),
      primaryTrait: summary.primaryTrait,
    );
  }

  Future<List<String>> _fetchBreedPhotos(String breedPath, {int count = 5}) async {
    final uri = Uri.parse('$_base/breed/$breedPath/images/random/$count');
    final res = await _client.get(uri);
    if (res.statusCode != 200) return const [];
    final Map<String, dynamic> body =
        jsonDecode(res.body) as Map<String, dynamic>;
    if (body['status'] != 'success') return const [];
    final dynamic msg = body['message'];
    if (msg is List) return msg.cast<String>();
    if (msg is String) return <String>[msg];
    return const [];
  }

  // ─── Adoption inquiry ──────────────────────────────────────────────────────

  /// `POST /api/adopt` — submit an adoption inquiry.
  ///
  /// Currently simulated. Real implementation would `_client.post` to the
  /// adoption endpoint with the form payload.
  Future<void> submitAdoptionInquiry({
    required String name,
    required String email,
    required String phone,
    required String message,
    required String dogId,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 900));
    // Real POST when an adoption back-end is available:
    //
    // final res = await _client.post(
    //   Uri.parse('https://your-api.example.com/api/adopt'),
    //   headers: {'Content-Type': 'application/json'},
    //   body: jsonEncode({
    //     'name': name, 'email': email, 'phone': phone,
    //     'message': message, 'dogId': dogId,
    //   }),
    // );
    // if (res.statusCode >= 400) throw ApiException('Submit failed');
  }

  // ─── URL → summary ─────────────────────────────────────────────────────────

  /// Image URLs look like:
  ///   https://images.dog.ceo/breeds/hound-afghan/n02088094_4037.jpg
  ///   https://images.dog.ceo/breeds/bulldog/n02096585_8413.jpg
  /// The path segment after `/breeds/` is `mainBreed[-subBreed]`.
  DogSummary? _summaryFromUrl(String url) {
    final breedSlug = _breedSlugFromUrl(url);
    if (breedSlug == null) return null;

    final breedDisplay = _slugToDisplayBreed(breedSlug);
    final rng = seededRandom(url);

    return DogSummary(
      id: url,
      name: _names[rng.nextInt(_names.length)],
      thumbnailUrl: url,
      age: _ageYears(rng),
      size: _sizeForBreed(breedSlug, rng),
      primaryTrait: _traitForBreed(breedSlug, rng),
      breed: breedDisplay,
    );
  }

  String? _breedSlugFromUrl(String url) {
    final m = RegExp(r'/breeds/([^/]+)/').firstMatch(url);
    return m?.group(1);
  }

  /// Convert e.g. `hound-afghan` → `hound/afghan` for the breed images
  /// endpoint, or `bulldog` → `bulldog`.
  String? _breedPathFromUrl(String url) {
    final slug = _breedSlugFromUrl(url);
    if (slug == null) return null;
    final parts = slug.split('-');
    if (parts.length == 1) return parts.first;
    return '${parts.first}/${parts.sublist(1).join('-')}';
  }

  /// `hound-afghan` → `Afghan Hound`. `bulldog` → `Bulldog`.
  String _slugToDisplayBreed(String slug) {
    final parts = slug.split('-');
    if (parts.length == 1) return _capitalize(parts.first);
    return '${_capitalize(parts.sublist(1).join(' '))} ${_capitalize(parts.first)}';
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  // ─── Deterministic mock helpers ────────────────────────────────────────────

  static const _names = [
    'Bailey', 'Luna', 'Cooper', 'Daisy', 'Charlie', 'Lucy', 'Max', 'Bella',
    'Rocky', 'Molly', 'Buddy', 'Sadie', 'Duke', 'Maggie', 'Zeus', 'Rosie',
    'Jack', 'Penny', 'Toby', 'Nala', 'Finn', 'Ruby', 'Milo', 'Coco',
    'Oscar', 'Willow', 'Leo', 'Hazel', 'Bear', 'Olive',
  ];

  static const _locations = [
    'Vancouver, BC', 'Burnaby, BC', 'Surrey, BC', 'Richmond, BC',
    'North Vancouver, BC', 'Coquitlam, BC', 'Langley, BC', 'Victoria, BC',
  ];

  // Rough breed → size buckets. Anything not listed gets a random fallback.
  static const _smallBreeds = {
    'chihuahua', 'pomeranian', 'pug', 'maltese', 'shihtzu', 'pekinese',
    'papillon', 'dachshund', 'affenpinscher', 'cavapoo', 'terrier-yorkshire',
    'terrier-toy', 'corgi-cardigan', 'bulldog-french',
  };
  static const _largeBreeds = {
    'mastiff', 'mastiff-bull', 'mastiff-english', 'mastiff-tibetan',
    'newfoundland', 'stbernard', 'wolfhound-irish', 'greatdane',
    'malamute', 'rottweiler', 'leonberg', 'pyrenees', 'bernese',
    'doberman', 'germanshepherd', 'husky', 'akita',
  };

  String _sizeForBreed(String slug, Random rng) {
    if (_smallBreeds.contains(slug) || slug.contains('toy')) return 'Small';
    if (_largeBreeds.contains(slug) ||
        slug.startsWith('mastiff') ||
        slug.contains('shepherd')) {
      return 'Large';
    }
    return ['Medium', 'Medium', 'Large', 'Small'][rng.nextInt(4)];
  }

  // Trait pools indexed by loose breed-group keywords in the slug.
  static const _calmTraits = ['Calm', 'Gentle', 'Affectionate', 'Loyal'];
  static const _energeticTraits = [
    'Energetic',
    'Playful',
    'Lively',
    'Athletic'
  ];
  static const _balancedTraits = ['Friendly', 'Sweet', 'Curious', 'Loyal'];

  String _traitForBreed(String slug, Random rng) {
    final s = slug.toLowerCase();
    if (s.contains('hound') ||
        s.contains('terrier') ||
        s.contains('shepherd') ||
        s.contains('spaniel') ||
        s.contains('retriever') ||
        s.contains('husky')) {
      return _energeticTraits[rng.nextInt(_energeticTraits.length)];
    }
    if (s.contains('mastiff') ||
        s.contains('bulldog') ||
        s.contains('chow') ||
        s.contains('newfoundland')) {
      return _calmTraits[rng.nextInt(_calmTraits.length)];
    }
    return _balancedTraits[rng.nextInt(_balancedTraits.length)];
  }

  int _ageYears(Random rng) {
    final r = rng.nextDouble();
    if (r < 0.15) return 1;
    if (r < 0.85) return 2 + rng.nextInt(5);
    return 8 + rng.nextInt(5);
  }

  String _pickLocation(Random rng) =>
      _locations[rng.nextInt(_locations.length)];

  double _weightFromSize(String size, Random rng) {
    switch (size) {
      case 'Small':
        return 4 + rng.nextInt(8).toDouble(); // 4–11kg
      case 'Large':
        return 28 + rng.nextInt(22).toDouble(); // 28–49kg
      default:
        return 12 + rng.nextInt(15).toDouble(); // 12–26kg
    }
  }

  int _energyFromTrait(String trait, Random rng) {
    final t = trait.toLowerCase();
    if (_energeticTraits.any((e) => e.toLowerCase() == t)) {
      return 4 + rng.nextInt(2);
    }
    if (_calmTraits.any((e) => e.toLowerCase() == t)) {
      return 1 + rng.nextInt(2);
    }
    return 2 + rng.nextInt(3);
  }

  String _generateBio(DogSummary s) {
    return "${s.name} is a ${s.age}-year-old ${s.breed.toLowerCase()} "
        "looking for a loving home. Known to be ${s.primaryTrait.toLowerCase()} "
        "and ${s.size == 'Large' ? 'a confident' : 'an easy-going'} companion, "
        "${s.name} would thrive with a family ready to share daily walks and "
        "a warm spot on the couch.";
  }
}

class ApiException implements Exception {
  ApiException(this.message);
  final String message;
  @override
  String toString() => 'ApiException: $message';
}

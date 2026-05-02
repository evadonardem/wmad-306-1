import 'package:adopt_a_dog/models/adoption_profile.dart';

class AdoptionProfileService {
  static const List<String> _ages = [
    '7 months',
    '1 year',
    '2 years',
    '3 years',
    '4 years',
    '6 years',
  ];

  static const List<String> _genders = ['Female', 'Male'];

  static const List<String> _sizes = ['Small', 'Medium', 'Large'];

  static const List<String> _temperaments = [
    'Gentle and social',
    'Playful and active',
    'Calm and cuddly',
    'Smart and curious',
    'Loyal and affectionate',
  ];

  static const List<String> _locations = [
    'Seattle, WA',
    'Austin, TX',
    'Denver, CO',
    'Boston, MA',
    'Portland, OR',
    'San Diego, CA',
  ];

  static const List<String> _shelterNames = [
    'Happy Tails Rescue',
    'Paws & Hearts Shelter',
    'Second Chance Animal Rescue',
    'Forever Home Dog Rescue',
    'Wagging Tails Humane Society',
    'Bright Futures Animal Shelter',
    'Loving Paws Foundation',
    'Hope Animal Rescue',
  ];

  static const List<String> _shelterPhones = [
    '(206) 555-0142',
    '(512) 555-0198',
    '(303) 555-0167',
    '(617) 555-0183',
    '(503) 555-0121',
    '(619) 555-0156',
    '(425) 555-0134',
    '(737) 555-0177',
  ];

  AdoptionProfile build({required String breedName, required String imageUrl}) {
    final seed = _hash('$breedName|$imageUrl');

    return AdoptionProfile(
      ageLabel: _ages[seed % _ages.length],
      gender: _genders[(seed ~/ 3) % _genders.length],
      size: _sizes[(seed ~/ 5) % _sizes.length],
      temperament: _temperaments[(seed ~/ 7) % _temperaments.length],
      location: _locations[(seed ~/ 11) % _locations.length],
      distanceMiles: 2 + (seed % 35),
      adoptionFee: 95 + (seed % 160),
      goodWithKids: (seed % 2) == 0,
      houseTrained: (seed % 3) != 0,
      vaccinated: (seed % 5) != 0,
      shelterName: _shelterNames[(seed ~/ 13) % _shelterNames.length],
      shelterPhone: _shelterPhones[(seed ~/ 13) % _shelterPhones.length],
    );
  }

  int _hash(String value) {
    var hash = 5381;
    for (final unit in value.codeUnits) {
      hash = ((hash << 5) + hash) ^ unit;
    }
    return hash.abs();
  }
}

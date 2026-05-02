class AdoptionProfile {
  final String ageLabel;
  final String gender;
  final String size;
  final String temperament;
  final String location;
  final int distanceMiles;
  final int adoptionFee;
  final bool goodWithKids;
  final bool houseTrained;
  final bool vaccinated;
  final String shelterName;
  final String shelterPhone;

  const AdoptionProfile({
    required this.ageLabel,
    required this.gender,
    required this.size,
    required this.temperament,
    required this.location,
    required this.distanceMiles,
    required this.adoptionFee,
    required this.goodWithKids,
    required this.houseTrained,
    required this.vaccinated,
    required this.shelterName,
    required this.shelterPhone,
  });
}

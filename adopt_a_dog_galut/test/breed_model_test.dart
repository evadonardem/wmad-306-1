import 'package:adopt_a_dog/models/breed.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Breed model', () {
    test('displayName returns breed name when sub-breed is null', () {
      const breed = Breed(name: 'hound', subBreeds: ['afghan']);

      expect(breed.displayName(), 'hound');
    });

    test('displayName returns sub-breed and breed when sub is provided', () {
      const breed = Breed(name: 'hound', subBreeds: ['afghan']);

      expect(breed.displayName(sub: 'afghan'), 'afghan hound');
    });
  });
}

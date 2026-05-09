import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import 'hero_image.dart';

class HeroCard extends StatelessWidget {
  final HeroModel hero;

  const HeroCard({super.key, required this.hero});

  int _calculateRating(HeroModel hero) {
    final stats = hero.powerStats;
    final total =
        stats.strength +
        stats.power +
        stats.intelligence +
        stats.durability +
        stats.combat;
    return (total / 50).clamp(1, 10).round();
  }

  String _getRarity(int rating) {
    if (rating == 10) return "God";
    if (rating >= 8) return "Legendary";
    if (rating >= 5) return "Epic";
    if (rating >= 3) return "Rare";
    return "Common";
  }

  Color _getRarityColor(int rating) {
    if (rating == 10) return Colors.red;
    if (rating >= 8) return Colors.orange;
    if (rating >= 5) return Colors.purple;
    if (rating >= 3) return Colors.green;
    return Colors.grey;
  }

  List<BoxShadow> _getRarityGlow(int rating) {
    if (rating == 10) {
      return [
        BoxShadow(
          color: Colors.redAccent.withOpacity(0.7),
          blurRadius: 16,
          spreadRadius: 2,
        ),
        BoxShadow(
          color: Colors.red.withOpacity(0.5),
          blurRadius: 32,
          spreadRadius: 4,
        ),
      ];
    }
    if (rating >= 8) {
      return [
        BoxShadow(
          color: Colors.orange.withOpacity(0.5),
          blurRadius: 12,
          spreadRadius: 2,
        ),
      ];
    }
    if (rating >= 5) {
      return [
        BoxShadow(
          color: Colors.purple.withOpacity(0.4),
          blurRadius: 8,
          spreadRadius: 1,
        ),
      ];
    }
    if (rating >= 3) {
      return [
        BoxShadow(
          color: Colors.green.withOpacity(0.3),
          blurRadius: 4,
          spreadRadius: 1,
        ),
      ];
    }
    return [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4)];
  }

  @override
  Widget build(BuildContext context) {
    final rating = _calculateRating(hero);
    final rarity = _getRarity(rating);
    final rarityColor = _getRarityColor(rating);
    final rarityGlow = _getRarityGlow(rating);

    return Container(
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: rarityColor, width: 2),
        gradient: LinearGradient(
          colors: [rarityColor.withOpacity(0.25), Colors.black],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: rarityGlow,
      ),
      child: Column(
        children: [
          /// IMAGE
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: buildHeroImage(
              hero.imageUrl,
              hero.name,
              height: 120,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),

          /// NAME
          Padding(
            padding: const EdgeInsets.all(6),
            child: Text(
              hero.name,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          /// ⭐ RATING
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(10, (i) {
              return Icon(
                Icons.star,
                size: 14,
                color: i < rating ? Colors.amber : Colors.grey,
              );
            }),
          ),

          /// RARITY LABEL
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(
              rarity,
              style: TextStyle(
                color: rarityColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
                shadows: [
                  Shadow(color: rarityColor.withOpacity(0.5), blurRadius: 8),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

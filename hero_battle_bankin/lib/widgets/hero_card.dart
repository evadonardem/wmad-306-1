import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import '../models/hero_model.dart';
import '../providers/deck_provider.dart';
import '../../router/app_router.dart'; 

class FlashyHeroCard extends StatelessWidget {
  final HeroModel hero;

  const FlashyHeroCard({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    final rarityColor = hero.rarityColor;
    final deckProv = context.watch<DeckProvider>(); // Using watch to sync star updates

    // --- GLOBAL STAR SYNC ---
    // Check if this hero has stars saved in the global vault
    final int savedStars = deckProv.globalUpgrades[hero.id] ?? 0;
    // Create a version of the hero that reflects the "sticking" stars
    final displayHero = hero.copyWith(stars: savedStars);

    return GestureDetector(
      onTap: () {
        // FIXED: Using direct string path to avoid "Member not found" errors
        Navigator.pushNamed(
          context, 
          '/hero', 
          arguments: displayHero,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [rarityColor.withOpacity(0.6), rarityColor.withOpacity(0.1)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5)),
            BoxShadow(color: rarityColor.withOpacity(0.1), blurRadius: 15, spreadRadius: 2),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: Stack(
            children: [
              // 1. IMAGE WITH 403 FIX
              Positioned.fill(
                child: Hero(
                  tag: 'hero-img-${displayHero.id}',
                  child: Image.network(
                    displayHero.imageUrl,
                    fit: BoxFit.cover,
                    // FIX: Adds User-Agent to prevent 403 Forbidden errors
                    headers: const {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                    },
                    errorBuilder: (context, error, stackTrace) =>
                        Container(
                          color: Colors.grey.shade900, 
                          child: const Icon(Icons.person, size: 50, color: Colors.white24)
                        ),
                  ),
                ),
              ),

              // 2. ADD BUTTON (Functional & Separate)
              Positioned(
                top: 8,
                left: 8,
                child: GestureDetector(
                  onTap: () {
                    final error = deckProv.validateAddition(displayHero);
                    if (error == null) {
                      deckProv.addToDeck(displayHero);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("${displayHero.name} added to Squad!")),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(error), backgroundColor: Colors.red),
                      );
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 20),
                  ),
                ),
              ),

              // 3. RARITY BADGE
              Positioned(
                top: 10,
                right: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: rarityColor,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    displayHero.rarity.name.toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 8),
                  ),
                ),
              ),

              // 4. INFO PANEL (Shows Stars and Upgraded Attack)
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: ClipRRect(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        border: Border(top: BorderSide(color: rarityColor.withOpacity(0.3), width: 1.5)),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Stars reflect the global vault
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(5, (i) => Icon(
                              Icons.star,
                              size: 14,
                              color: i < displayHero.stars ? Colors.amber : Colors.grey.shade600,
                            )),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            displayHero.name,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            "ATK: ${displayHero.attack}",
                            style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
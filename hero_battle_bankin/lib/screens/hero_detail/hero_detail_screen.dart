import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';

class HeroDetailScreen extends StatelessWidget {
  final HeroModel hero;

  const HeroDetailScreen({super.key, required this.hero});

  @override
  Widget build(BuildContext context) {
    // Sync with global upgrades to ensure stars show correctly here
    final deckProv = context.watch<DeckProvider>();
    final int savedStars = deckProv.globalUpgrades[hero.id] ?? 0;
    final displayHero = hero.copyWith(stars: savedStars);

    return Scaffold(
      appBar: AppBar(
        title: Text(displayHero.name),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Header with 403 Fix
            SizedBox(
              height: 300,
              child: displayHero.imageUrl.isEmpty
                  ? Container(color: Colors.grey[800], child: const Icon(Icons.broken_image, size: 100))
                  : Image.network(
                      displayHero.imageUrl,
                      fit: BoxFit.cover,
                      // FIX: Bypass 403 Forbidden
                      headers: const {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                      },
                      errorBuilder: (_, __, ___) => Container(color: Colors.grey[800], child: const Icon(Icons.broken_image, size: 100)),
                    ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // --- STAR DISPLAY ---
                  Row(
                    children: [
                      Text('Rank:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey[600])),
                      const SizedBox(width: 8),
                      Row(
                        children: List.generate(5, (i) => Icon(
                          Icons.star,
                          size: 20,
                          color: i < displayHero.stars ? Colors.amber : Colors.grey[300],
                        )),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Text('Biography', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const Divider(),
                  _buildBioRow('Full Name:', displayHero.fullName.isEmpty ? 'Unknown' : displayHero.fullName),
                  _buildBioRow('Publisher:', displayHero.publisher.isEmpty ? 'Unknown' : displayHero.publisher),
                  _buildBioRow('Alignment:', displayHero.alignment.toUpperCase()),
                  
                  const SizedBox(height: 24),
                  
                  Text('Base Power Stats', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const Divider(),
                  Row(
                    children: [
                      Expanded(child: _buildStatColumn('INT', displayHero.powerStats.intelligence, Colors.blue)),
                      Expanded(child: _buildStatColumn('STR', displayHero.powerStats.strength, Colors.red)),
                      Expanded(child: _buildStatColumn('SPD', displayHero.powerStats.speed, Colors.yellow.shade700)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatColumn('DUR', displayHero.powerStats.durability, Colors.green)),
                      Expanded(child: _buildStatColumn('POW', displayHero.powerStats.power, Colors.purple)),
                      Expanded(child: _buildStatColumn('COM', displayHero.powerStats.combat, Colors.orange)),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  Text('Combat Engine Stats', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const Divider(),
                  _buildBioRow('Max HP:', displayHero.maxHp.toString()),
                  // Updated to show upgraded attack
                  _buildBioRow('Total Attack:', displayHero.attack.toString()), 
                  _buildBioRow('Special Attack:', displayHero.specialAttack.toString()),
                  _buildBioRow('Defense:', displayHero.defense.toString()),
                  _buildBioRow('Initiative:', displayHero.initiative.toString()),
                  
                  const SizedBox(height: 32),
                ],
              ),
            )
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Consumer<DeckProvider>(
            builder: (context, deckProv, _) {
              final isInDeck = deckProv.isInDeck(displayHero); 
              final teamPower = deckProv.totalAttackPower;
              final tier = deckProv.matchmakingTier;

              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Active Tier:", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                        Text(
                          tier,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Team Power:", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                        Text(
                          "$teamPower ATK",
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                      backgroundColor: isInDeck ? Colors.red.shade700 : Colors.deepPurple,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      if (isInDeck) {
                        deckProv.removeFromDeck(displayHero);
                      } else {
                        final error = deckProv.validateAddition(displayHero);
                        if (error != null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(error), backgroundColor: Colors.orange.shade900),
                          );
                        } else {
                          deckProv.addToDeck(displayHero);
                        }
                      }
                    },
                    child: Text(
                      isInDeck ? 'REMOVE FROM DECK' : 'ADD TO DECK',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildBioRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(width: 8),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, int value, Color color) {
    return Column(
      children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 4),
        Text(value.toString(), style: const TextStyle(fontSize: 18)),
      ],
    );
  }
}
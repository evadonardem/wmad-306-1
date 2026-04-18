import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../providers/deck_provider.dart';
import '../../models/hero_model.dart';

class UpgradeScreen extends StatelessWidget {
  const UpgradeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final playerProv = context.watch<PlayerProvider>();
    final deckProv = context.watch<DeckProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Blacksmith & Armory'),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Chip(
              label: Text('${playerProv.coins} 🪙', 
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              backgroundColor: Colors.amber.shade900,
            ),
          )
        ],
      ),
      body: deckProv.deck.isEmpty 
          ? const Center(child: Text("Add heroes to your deck to begin forging!"))
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: deckProv.deck.length,
              itemBuilder: (context, index) {
                final hero = deckProv.deck[index];
                int upgradeCost = (hero.stars + 1) * 200;
                bool canAfford = playerProv.coins >= upgradeCost;
                bool isMaxed = hero.stars >= 5;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                    side: BorderSide(color: hero.rarityColor.withOpacity(0.5), width: 2),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        radius: 30,
                        backgroundImage: NetworkImage(hero.imageUrl),
                        backgroundColor: Colors.grey.shade900,
                      ),
                      title: Text(hero.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          // Star Display
                          Row(
                            children: List.generate(5, (i) => Icon(
                              Icons.star, 
                              size: 18, 
                              color: i < hero.stars ? Colors.amber : Colors.grey.shade300
                            )),
                          ),
                          const SizedBox(height: 4),
                          Text("Current ATK: ${hero.attack}", style: const TextStyle(fontSize: 12)),
                        ],
                      ),
                      trailing: ElevatedButton(
                        onPressed: (canAfford && !isMaxed) 
                          ? () => _handleUpgrade(context, hero, playerProv, deckProv, upgradeCost)
                          : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isMaxed ? Colors.grey : Colors.green.shade700,
                          foregroundColor: Colors.white,
                        ),
                        child: Text(isMaxed ? 'MAXED' : 'FORGE (${upgradeCost}🪙)'),
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }

  void _handleUpgrade(BuildContext context, HeroModel hero, PlayerProvider player, DeckProvider deck, int cost) {
    if (player.spendCoins(cost)) {
      deck.upgradeHeroStars(hero.id);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("🔥 ${hero.name} forged to ${hero.stars + 1} Stars! ATK +3"),
          backgroundColor: Colors.deepPurple,
        )
      );
    }
  }
}
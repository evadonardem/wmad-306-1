import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../widgets/hero_card.dart'; // FlashyHeroCard is here
import '../upgrade/upgrade_screen.dart'; 
import '../../models/hero_model.dart';

class DeckBuilderScreen extends StatelessWidget {
  const DeckBuilderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final deckProv = context.watch<DeckProvider>();
    final deck = deckProv.deck;
    
    int teamPower = deck.isEmpty 
        ? 0 
        : deck.map((h) => h.totalStats).reduce((a, b) => a + b);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.primary.withOpacity(0.1),
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(context, deckProv, teamPower),
              _buildRoleTracker(deck),
              const Divider(height: 1),
              _buildTeamSlots(context, deckProv),
              _buildBottomAction(context, deck),
            ],
          ),
        ),
      ),
    );
  }

  // --- 1. THE TOP HEADER: Back Button, Forge, Coin UI & Power Score ---
  Widget _buildHeader(BuildContext context, DeckProvider prov, int power) {
    final playerProv = context.watch<PlayerProvider>();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // BACK BUTTON + TITLE
              Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.only(right: 12),
                    style: IconButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                    ),
                  ),
                  const Text("TACTICAL SQUAD", 
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
                ],
              ),
              
              // COIN & FORGE UI
              Row(
                children: [
                  // Coin Display Button
                  GestureDetector(
                    onTap: () => _showCoinBounty(context, playerProv),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black87,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.amber, width: 1),
                      ),
                      child: Row(
                        children: [
                          Text('${playerProv.coins}', 
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          const SizedBox(width: 4),
                          const Icon(Icons.add_circle, color: Colors.amber, size: 14),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Forge Button
                  IconButton(
                    icon: const Icon(Icons.build_circle, color: Colors.amber, size: 28),
                    onPressed: () => Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (context) => const UpgradeScreen())
                    ),
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),

              // POWER SCORE
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.2), 
                  borderRadius: BorderRadius.circular(20), 
                  border: Border.all(color: Colors.amber)
                ),
                child: Text("⚡ PWR: $power", 
                  style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 10)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Team Slot Switcher (Team 1, Team 2, Team 3)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: prov.allTeams.keys.map((name) {
                bool isSelected = prov.activeTeamName == name;
                int heroCount = prov.allTeams[name]!.length;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text("$name ($heroCount/5)"),
                    selected: isSelected,
                    selectedColor: Colors.deepPurple,
                    labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black, fontSize: 12),
                    onSelected: (val) => val ? prov.setActiveTeam(name) : null,
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  // Coin Bounty Shop Simulation
  void _showCoinBounty(BuildContext context, PlayerProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.grey[900],
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("TREASURY", style: TextStyle(color: Colors.amber, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListTile(
              tileColor: Colors.white10,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              leading: const Icon(Icons.generating_tokens, color: Colors.amber, size: 40),
              title: const Text("Daily Bounty", style: TextStyle(color: Colors.white)),
              subtitle: const Text("Claim 500 free coins", style: TextStyle(color: Colors.grey)),
              trailing: ElevatedButton(
                onPressed: () {
                  provider.earnCoins(500);
                  Navigator.pop(context);
                },
                child: const Text("CLAIM"),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // --- 2. THE ROLE TRACKER: MLBB Style Diversity check ---
  Widget _buildRoleTracker(List<dynamic> deck) {
    final roles = deck.map((h) => h.role).toList();
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _roleIcon('🛡️', roles.any((r) => r.contains('Tank'))),
          _roleIcon('🔮', roles.any((r) => r.contains('Mage'))),
          _roleIcon('🗡️', roles.any((r) => r.contains('Assassin'))),
          _roleIcon('🏹', roles.any((r) => r.contains('Marksman'))),
          _roleIcon('🌿', roles.any((r) => r.contains('Support'))),
        ],
      ),
    );
  }

  Widget _roleIcon(String icon, bool active) {
    return Opacity(
      opacity: active ? 1.0 : 0.2,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: active ? Colors.blue.withOpacity(0.1) : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Text(icon, style: const TextStyle(fontSize: 20)),
      ),
    );
  }

  // --- 3. THE SQUAD GRID: Cards + Empty Ghost Slots ---
  Widget _buildTeamSlots(BuildContext context, DeckProvider prov) {
    final deck = prov.deck;
    return Expanded(
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.68,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: 5,
        itemBuilder: (context, index) {
          if (index < deck.length) {
            // FIXED: Using FlashyHeroCard
            return FlashyHeroCard(hero: deck[index]);
          } else {
            return _buildGhostSlot(context);
          }
        },
      ),
    );
  }

  Widget _buildGhostSlot(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withOpacity(0.2), width: 2, style: BorderStyle.solid),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.add_moderator, size: 40, color: Colors.grey.withOpacity(0.3)),
          const SizedBox(height: 8),
          const Text("EMPTY SLOT", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  // --- 4. BOTTOM ACTION: Select Arena Mission ---
  Widget _buildBottomAction(BuildContext context, List<dynamic> deck) {
    bool isFull = deck.length == 5;
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ElevatedButton(
        onPressed: deck.isNotEmpty ? () => _showModeSheet(context) : null,
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 60),
          backgroundColor: isFull ? Colors.deepPurple : Colors.grey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: Text(
          isFull ? "READY FOR BATTLE" : "RECRUIT ${5 - deck.length} MORE",
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
    );
  }

  void _showModeSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, margin: const EdgeInsets.only(bottom: 20), 
              decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const Text("DEPLOYMENT MISSION", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 2, color: Colors.grey)),
            const SizedBox(height: 8),
            const Text("CHOOSE ARENA", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
            const SizedBox(height: 24),
            _arenaMissionCard(
              context,
              title: "RANKED DUEL",
              type: "1v1 COMBAT",
              desc: "Test your individual hero's power and climb the ranks.",
              icon: Icons.person_outline,
              color: Colors.redAccent,
              route: RouteNames.battle,
            ),
            const SizedBox(height: 16),
            _arenaMissionCard(
              context,
              title: "TEAM SKIRMISH",
              type: "5v5 TACTICAL",
              desc: "Command your full squad. Synergy and roles are key to victory.",
              icon: Icons.groups_outlined,
              color: Colors.amber.shade700,
              route: RouteNames.teamBattle,
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _arenaMissionCard(BuildContext context, {required String title, required String type, required String desc, required IconData icon, required Color color, required String route}) {
    return InkWell(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamed(context, route);
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.3), width: 1.5),
          gradient: LinearGradient(colors: [color.withOpacity(0.15), Colors.transparent], begin: Alignment.topLeft, end: Alignment.bottomRight),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(15)),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(type, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 1.5)),
                  const SizedBox(height: 4),
                  Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 4),
                  Text(desc, style: TextStyle(fontSize: 12, color: Colors.grey.shade600, height: 1.3)),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 16, color: color.withOpacity(0.5)),
          ],
        ),
      ),
    );
  }
}
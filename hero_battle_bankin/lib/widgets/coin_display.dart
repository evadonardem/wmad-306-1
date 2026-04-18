import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/player_provider.dart';

class CoinDisplay extends StatelessWidget {
  const CoinDisplay({super.key});

  void _showCoinShop(BuildContext context, PlayerProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A1A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("TREASURY", style: TextStyle(color: Colors.amber, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            ListTile(
              tileColor: Colors.white.withOpacity(0.05),
              leading: const Icon(Icons.stars, color: Colors.amber, size: 32),
              title: const Text("Daily Bounty", style: TextStyle(color: Colors.white)),
              subtitle: const Text("Claim 500 free coins"),
              trailing: ElevatedButton(
                onPressed: () {
                  provider.earnCoins(500);
                  Navigator.pop(context);
                },
                child: const Text("CLAIM"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final playerProv = context.watch<PlayerProvider>();

    return GestureDetector(
      onTap: () => _showCoinShop(context, playerProv),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.black45,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.amber, width: 1.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('${playerProv.coins}', 
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(width: 6),
            const Icon(Icons.add_circle, color: Colors.amber, size: 18),
          ],
        ),
      ),
    );
  }
}
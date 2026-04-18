import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/battle_provider.dart';

class RankingScreen extends StatelessWidget {
  const RankingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final battleProv = context.watch<BattleProvider>();
    // Note: Ensure these getters exist in your BattleProvider
    final soloRanks = battleProv.soloRankings;
    final teamWins = battleProv.totalTeamWins;

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('HALL OF FAME', 
            style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2)),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.person), text: "SOLO HEROES"),
              Tab(icon: Icon(Icons.groups), text: "TEAM SQUAD"),
            ],
          ),
        ),
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Theme.of(context).colorScheme.surface, 
                Theme.of(context).colorScheme.primary.withOpacity(0.05)
              ],
            ),
          ),
          child: TabBarView(
            children: [
              _buildSoloRanking(soloRanks),
              _buildTeamRanking(teamWins),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSoloRanking(Map<String, int> ranks) {
    if (ranks.isEmpty) return const Center(child: Text("No victories recorded yet."));

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: ranks.length,
      itemBuilder: (context, index) {
        String name = ranks.keys.elementAt(index);
        int wins = ranks.values.elementAt(index);
        
        Color? crownColor;
        if (index == 0) crownColor = Colors.amber;
        if (index == 1) crownColor = Colors.grey.shade400;
        if (index == 2) crownColor = Colors.brown.shade300;

        return Card(
          elevation: index < 3 ? 4 : 1,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: crownColor ?? Colors.blueGrey.shade100,
              child: Text("${index + 1}", 
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
            ),
            title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text("Ranked Match Wins"),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1), 
                borderRadius: BorderRadius.circular(20)
              ),
              child: Text("🏆 $wins", 
                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTeamRanking(int wins) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.stars, size: 80, color: Colors.amber),
          const SizedBox(height: 16),
          const Text("SQUAD PRESTIGE", 
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Text("Total 5v5 Victories: $wins", 
            style: const TextStyle(fontSize: 18, color: Colors.grey)),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(20),
            margin: const EdgeInsets.symmetric(horizontal: 40),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.amber, width: 2),
            ),
            child: const Text(
              "Winning team battles increases your Global Squad Rank. Keep fighting to reach Mythic!",
              textAlign: TextAlign.center,
              style: TextStyle(fontStyle: FontStyle.italic),
            ),
          )
        ],
      ),
    );
  }
}
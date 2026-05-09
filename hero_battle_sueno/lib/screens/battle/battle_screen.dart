import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../models/hero_model.dart';
import '../../router/app_router.dart';
import '../../widgets/hero_image.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  bool _dialogShown = false;

  @override
  Widget build(BuildContext context) {
    final provider = context.read<BattleProvider>();
    final deck = context.read<DeckProvider>().deck;

    return Consumer<BattleProvider>(
      builder: (context, battle, _) {
        /// ✅ AUTO START ONLY IF:
        /// - no hero loaded
        /// - AND battle is not already finished
        if (battle.playerHero == null &&
            !battle.isFinished &&
            deck.length >= 2) {
          Future.microtask(() {
            provider.startBattle(deck);
          });
        }

        // RESET GUARD FIRST
        if (!battle.isFinished) {
          _dialogShown = false;
        }

        // SHOW ONLY ONCE AFTER FINISH
        if (battle.isFinished && !_dialogShown) {
          _dialogShown = true;
          Future.microtask(() {
            _showEndDialog(context, battle.result.contains("WIN"));
          });
        }

        final player = battle.playerHero;
        final enemy = battle.enemyHero;

        if (player == null || enemy == null) {
          return const Scaffold(body: Center(child: Text("Loading battle...")));
        }

        return Scaffold(
          appBar: AppBar(title: const Text("Battle")),
          body: Stack(
            children: [
              Positioned.fill(
                child: Image.asset(
                  'assets/images/arena.jpg',
                  fit: BoxFit.cover,
                ),
              ),
              SafeArea(
                child: Column(
                  children: [
                    const SizedBox(height: 10),
                    Text(
                      "⚔️ ${player.name} vs ${enemy.name}",
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _hero(player, battle.playerHp),
                        _hero(enemy, battle.enemyHp),
                      ],
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: battle.isFinished
                          ? null
                          : () =>
                                context.read<BattleProvider>().attack(context),
                      child: const Text("Attack"),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      battle.result,
                      style: const TextStyle(color: Colors.white),
                    ),
                    Expanded(
                      child: ListView.builder(
                        itemCount: battle.battleLog.length,
                        itemBuilder: (_, i) => Text(
                          battle.battleLog[i],
                          style: const TextStyle(color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _hero(HeroModel hero, int hp) {
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.white, width: 2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: buildHeroImage(hero.imageUrl, hero.name, height: 110),
        ),
        const SizedBox(height: 6),
        SizedBox(
          width: 100,
          child: LinearProgressIndicator(
            value: hp / hero.maxHp,
            color: Colors.green,
            backgroundColor: Colors.grey,
          ),
        ),
        Text("HP: $hp", style: const TextStyle(color: Colors.white)),
      ],
    );
  }

  void _showEndDialog(BuildContext context, bool isWin) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        title: Text(isWin ? "Victory 🎉" : "Defeat 💀"),
        content: const Text("What would you like to do?"),
        actions: [
          // 🔁 RETRY
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              final p = context.read<BattleProvider>();
              p.startBattle(p.playerDeck, customEnemy: p.enemyDeck);
            },
            child: const Text("Retry"),
          ),
          // 🏠 HOME (FULL RESET — IMPORTANT)
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              final p = context.read<BattleProvider>();
              // 🔥 FULL RESET
              p.isFinished = false;
              p.result = "";
              p.battleLog.clear();
              p.playerHero = null;
              p.enemyHero = null;
              Navigator.pushNamedAndRemoveUntil(
                context,
                RouteNames.home,
                (route) => false,
              );
            },
            child: const Text("Home"),
          ),
          // ❌ QUIT
          TextButton(
            onPressed: () {
              SystemNavigator.pop();
            },
            child: const Text("QUIT"),
          ),
        ],
      ),
    );
  }
}

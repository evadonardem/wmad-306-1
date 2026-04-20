import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart';

import '../../models/hero_model.dart';
import 'battle_scenario_dialog.dart';
import '../../engine/battle_engine.dart';

class BattleScreen extends StatelessWidget {
  const BattleScreen({super.key});

  List<HeroModel> _generateEnemyDeck(List<HeroModel> playerDeck) {
    // For demo: shuffle player deck for enemy
    return List<HeroModel>.from(playerDeck)..shuffle();
  }

  @override
  Widget build(BuildContext context) {
    final deckProvider = Provider.of<DeckProvider>(context);
    final battleProvider = Provider.of<BattleProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Battle')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: const Text('⚡ Scenario Battle!'),
              onPressed: deckProvider.deck.isEmpty
                  ? null
                  : () async {
                      // ...existing code for scenario battle...
                      try {
                        final enemyDeck = _generateEnemyDeck(deckProvider.deck);
                        final playerDeck = deckProvider.deck;
                        final log = <String>[];
                        int playerScore = 0;
                        int enemyScore = 0;
                        for (int i = 0; i < playerDeck.length; i++) {
                          final p = playerDeck[i];
                          final e = enemyDeck.length > i
                              ? enemyDeck[i]
                              : enemyDeck[0];
                          int playerHp = p.maxHp;
                          int enemyHp = e.maxHp;
                          bool playerFirst = p.initiative >= e.initiative;
                          String playerAction = 'attack';
                          String enemyAction = 'attack';

                          // Show scenario dialog for player action
                          await showDialog(
                            context: context,
                            barrierDismissible: false,
                            builder: (_) => BattleScenarioDialog(
                              playerHero: p,
                              enemyHero: e,
                              round: i + 1,
                              onActionSelected: (action) {
                                playerAction = action;
                                Navigator.of(context).pop();
                              },
                            ),
                          );

                          // Simple AI for enemy
                          enemyAction = ['attack', 'defend', 'special'][i % 3];

                          // Battle logic with actions
                          while (playerHp > 0 && enemyHp > 0) {
                            if (playerFirst) {
                              if (playerAction == 'attack') {
                                enemyHp -= (p.attack - e.defense).clamp(5, 50);
                              } else if (playerAction == 'defend') {
                                playerHp += 10;
                              } else if (playerAction == 'special') {
                                enemyHp -= (p.specialAttack - e.defense).clamp(
                                  10,
                                  60,
                                );
                              }
                              if (enemyHp <= 0) break;
                              if (enemyAction == 'attack') {
                                playerHp -= (e.attack - p.defense).clamp(5, 50);
                              } else if (enemyAction == 'defend') {
                                enemyHp += 10;
                              } else if (enemyAction == 'special') {
                                playerHp -= (e.specialAttack - p.defense).clamp(
                                  10,
                                  60,
                                );
                              }
                            } else {
                              if (enemyAction == 'attack') {
                                playerHp -= (e.attack - p.defense).clamp(5, 50);
                              } else if (enemyAction == 'defend') {
                                enemyHp += 10;
                              } else if (enemyAction == 'special') {
                                playerHp -= (e.specialAttack - p.defense).clamp(
                                  10,
                                  60,
                                );
                              }
                              if (playerHp <= 0) break;
                              if (playerAction == 'attack') {
                                enemyHp -= (p.attack - e.defense).clamp(5, 50);
                              } else if (playerAction == 'defend') {
                                playerHp += 10;
                              } else if (playerAction == 'special') {
                                enemyHp -= (p.specialAttack - e.defense).clamp(
                                  10,
                                  60,
                                );
                              }
                            }
                          }
                          if (playerHp > 0) {
                            log.add(
                              'Round \\${i + 1}: \\${p.name} defeats \\${e.name}',
                            );
                            playerScore++;
                          } else {
                            log.add(
                              'Round \\${i + 1}: \\${e.name} defeats \\${p.name}',
                            );
                            enemyScore++;
                          }
                        }
                        log.add('---');
                        log.add(
                          'Final: Player \\${playerScore} - Enemy \\${enemyScore}',
                        );
                        String result = playerScore > enemyScore
                            ? 'Win'
                            : playerScore < enemyScore
                            ? 'Lose'
                            : 'Draw';
                        String resultText = result == 'Win'
                            ? 'You Win!'
                            : result == 'Lose'
                            ? 'You Lose!'
                            : 'Draw!';
                        showDialog(
                          context: context,
                          barrierDismissible: false,
                          builder: (_) => AlertDialog(
                            title: const Text('Battle Result'),
                            content: SizedBox(
                              width: 300,
                              child: SingleChildScrollView(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ...log.map((e) => Text(e)),
                                    const SizedBox(height: 16),
                                    Center(
                                      child: Text(
                                        resultText,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 20,
                                          color: result == 'Win'
                                              ? Colors.green
                                              : result == 'Lose'
                                              ? Colors.red
                                              : Colors.orange,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context).pop();
                                  Navigator.of(context).popUntil(
                                    (route) =>
                                        route.settings.name == '/' ||
                                        route.isFirst,
                                  );
                                },
                                child: const Text('End Game & Go Home'),
                              ),
                            ],
                          ),
                        );
                      } catch (e) {
                        print('Battle error: $e');
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to start battle: $e')),
                        );
                      }
                    },
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              child: const Text('🥇 Last Hero Standing'),
              onPressed: deckProvider.deck.length < 2
                  ? null
                  : () {
                      // Use all heroes in the deck for battle royale
                      final result = BattleEngine.battleRoyale(
                        deckProvider.deck,
                      );
                      final winner = result['winner'] as String;
                      final log = result['log'] as List<String>;
                      showDialog(
                        context: context,
                        barrierDismissible: false,
                        builder: (_) => AlertDialog(
                          title: const Text('Last Hero Standing'),
                          content: SizedBox(
                            width: 300,
                            child: SingleChildScrollView(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ...log.map((e) => Text(e)),
                                  const SizedBox(height: 16),
                                  Center(
                                    child: Text(
                                      'Winner: $winner',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 20,
                                        color: Colors.amber,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                              child: const Text('Close'),
                            ),
                          ],
                        ),
                      );
                    },
            ),
          ],
        ),
      ),
    );
  }
}

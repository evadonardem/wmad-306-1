import 'dart:math';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../providers/battle_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/player_provider.dart';
import '../../models/hero_model.dart';
import '../../services/superhero_api_service.dart';
import '../../constants.dart';
import '../../widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});
  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  final _api = SuperheroApiService(apiToken: kApiToken);
  final _scrollController = ScrollController();
  bool _loadingAi = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _setupBattle());
  }

  Future<void> _setupBattle() async {
    final deck = context.read<DeckProvider>();
    final battle = context.read<BattleProvider>();
    if (deck.deck.isEmpty) return;

    setState(() => _loadingAi = true);
    try {
      final aiId = Random().nextInt(731) + 1;
      final aiHero = await _api.fetchHero(aiId);
      final playerHero = deck.deck[Random().nextInt(deck.deck.length)];
      battle.startBattle(playerHero, aiHero);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load AI hero: $e'), backgroundColor: const Color(0xFFF87171)),
        );
      }
    } finally {
      if (mounted) setState(() => _loadingAi = false);
    }
  }

  void _scrollLog() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFFA855F7)),
          onPressed: () {
            context.read<BattleProvider>().resetBattle();
            Navigator.pop(context);
          },
        ),
        title: const Text('Battle Arena', style: TextStyle(color: Color(0xFFE2D9F3), fontWeight: FontWeight.w600)),
      ),
      body: Consumer<BattleProvider>(
        builder: (context, battle, _) {
          if (_loadingAi || battle.state == BattleState.idle) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: Color(0xFF7B2FBE)),
                  SizedBox(height: 16),
                  Text('Summoning opponent...', style: TextStyle(color: Color(0xFF9370DB), fontSize: 14)),
                ],
              ),
            );
          }

          _scrollLog();

          return Column(
            children: [
              // Round badge
              Container(
                margin: const EdgeInsets.symmetric(vertical: 10),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
                ),
                child: Text(
                  'Round ${battle.round}',
                  style: const TextStyle(fontSize: 13, color: Color(0xFF9370DB), fontWeight: FontWeight.w500),
                ),
              ),

              // Fighters row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  children: [
                    Expanded(child: _FighterCard(hero: battle.playerHero!, hp: battle.playerHp, maxHp: battle.playerMaxHp, isPlayer: true)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Column(
                        children: [
                          const Text('⚔️', style: TextStyle(fontSize: 24)),
                          const SizedBox(height: 4),
                          Text('VS', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3), fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    Expanded(child: _FighterCard(hero: battle.aiHero!, hp: battle.aiHp, maxHp: battle.aiMaxHp, isPlayer: false)),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Battle log
              Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A2E),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF2A2A3E), width: 0.5),
                  ),
                  child: Column(
                    children: [
                      const Padding(
                        padding: EdgeInsets.fromLTRB(14, 10, 14, 6),
                        child: Row(
                          children: [
                            Icon(Icons.article_rounded, color: Color(0xFF666666), size: 14),
                            SizedBox(width: 6),
                            Text('Battle Log', style: TextStyle(fontSize: 11, color: Color(0xFF666666), letterSpacing: 1)),
                          ],
                        ),
                      ),
                      const Divider(color: Color(0xFF2A2A3E), height: 1),
                      Expanded(
                        child: ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(10),
                          itemCount: battle.log.length,
                          itemBuilder: (_, i) {
                            final entry = battle.log[i];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 5),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 3,
                                    height: 16,
                                    margin: const EdgeInsets.only(right: 8, top: 2),
                                    decoration: BoxDecoration(
                                      color: entry.isPlayer ? const Color(0xFFA855F7) : const Color(0xFFF87171),
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                  Expanded(
                                    child: Text(
                                      entry.message,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: entry.isPlayer ? const Color(0xFFC49DEA) : const Color(0xFFFCA5A5),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 10),

              // Action buttons
              if (!battle.isOver)
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 0, 12, 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => battle.attack(),
                          icon: const Icon(Icons.sports_martial_arts_rounded),
                          label: const Text('Attack', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF7B2FBE),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => battle.specialAttack(),
                          icon: const Text('✨', style: TextStyle(fontSize: 14)),
                          label: const Text('Special', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1A1A2E),
                            foregroundColor: const Color(0xFFA855F7),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            side: const BorderSide(color: Color(0xFF7B2FBE)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              else
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 0, 12, 20),
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: battle.state == BattleState.playerWon
                              ? const Color(0xFF0F2D1F)
                              : const Color(0xFF2D0F0F),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: battle.state == BattleState.playerWon
                                ? const Color(0xFF4ADE80)
                                : const Color(0xFFF87171),
                          ),
                        ),
                        child: Text(
                          battle.state == BattleState.playerWon ? '🏆 Victory!' : '💀 Defeated',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: battle.state == BattleState.playerWon
                                ? const Color(0xFF4ADE80)
                                : const Color(0xFFF87171),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            // Update player stats
                            final player = context.read<PlayerProvider>();
                            battle.state == BattleState.playerWon
                                ? player.incrementWins()
                                : player.incrementLosses();
                            battle.resetBattle();
                            _setupBattle();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF7B2FBE),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Battle Again', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}

class _FighterCard extends StatelessWidget {
  final HeroModel hero;
  final int hp;
  final int maxHp;
  final bool isPlayer;

  const _FighterCard({required this.hero, required this.hp, required this.maxHp, required this.isPlayer});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPlayer ? const Color(0xFF7B2FBE) : const Color(0xFFBE2F2F),
          width: 0.8,
        ),
      ),
      child: Column(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: hero.imageUrl.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: hero.imageUrl,
                    width: 70, height: 70,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => const SizedBox(
                      width: 70, height: 70,
                      child: Center(child: Text('🦸', style: TextStyle(fontSize: 36))),
                    ),
                    errorWidget: (_, __, ___) => const SizedBox(
                      width: 70, height: 70,
                      child: Center(child: Text('🦸', style: TextStyle(fontSize: 36))),
                    ),
                  )
                : const SizedBox(
                    width: 70, height: 70,
                    child: Center(child: Text('🦸', style: TextStyle(fontSize: 36))),
                  ),
          ),
          const SizedBox(height: 6),
          Text(
            isPlayer ? 'YOU' : 'AI',
            style: TextStyle(
              fontSize: 9,
              color: isPlayer ? const Color(0xFF9370DB) : const Color(0xFFF87171),
              letterSpacing: 1,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            hero.name,
            style: const TextStyle(fontSize: 11, color: Color(0xFFE2D9F3), fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          HpBar(
            current: hp,
            max: maxHp,
            color: isPlayer ? const Color(0xFFA855F7) : const Color(0xFFF87171),
          ),
        ],
      ),
    );
  }
}

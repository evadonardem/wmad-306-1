import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../models/battle_record.dart';
import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart';
import '../../engine/battle_engine.dart';
import '../../services/superhero_api_service.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  HeroModel? _selectedHero;
  bool _isSearching = false;
  bool _isInCombat = false;
  
  Fighter? _player;
  Fighter? _enemy;
  int _round = 1;
  bool _isPlayerTurn = true;
  bool _matchSaved = false; 
  List<String> _combatLog = [];

  bool _isAnimating = false;
  Fighter? _attackingFighter;
  Fighter? _defendingFighter;

  final int _hpMultiplier = 10; 

  void _startCombatPhase() async {
    if (_selectedHero == null) return;
    setState(() => _isSearching = true);

    final playerAtk = _selectedHero!.attack;
    final minRange = (playerAtk * 0.85).round();
    final maxRange = (playerAtk * 1.15).round();

    try {
      final api = SuperheroApiService(apiToken: '7905a60ab03c8c9260b99f2c57de7d16');
      
      HeroModel? balancedOpponent;
      
      for (int i = 0; i < 15; i++) {
        final potential = await api.fetchHero(Random().nextInt(731) + 1);
        if (potential.attack >= minRange && potential.attack <= maxRange) {
          balancedOpponent = potential;
          break;
        }
      }

      balancedOpponent ??= await api.fetchHero(Random().nextInt(731) + 1);

      setState(() {
        _player = Fighter(hero: _selectedHero!, multiplier: _hpMultiplier);
        _enemy = Fighter(hero: balancedOpponent!, multiplier: _hpMultiplier);
        
        _combatLog = ['⚔️ MATCH START: ${_player!.hero.name} VS ${_enemy!.hero.name}'];
        _round = 1;
        _matchSaved = false;
        
        _isPlayerTurn = _player!.hero.initiative >= _enemy!.hero.initiative;
        if (!_isPlayerTurn) {
          _combatLog.add('💨 ${_enemy!.hero.name} is faster and attacks first!');
          _triggerEnemyTurn();
        } else {
          _combatLog.add('💨 ${_player!.hero.name} is faster and attacks first!');
        }
        
        _isSearching = false;
        _isInCombat = true; 
      });
    } catch (e) {
      setState(() => _isSearching = false);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to find opponent.')));
    }
  }

  void _playerAction(CombatAction action) async {
    if (!_isPlayerTurn || _player!.hp <= 0 || _enemy!.hp <= 0 || _isAnimating) return;

    setState(() {
      _isAnimating = true;
      _attackingFighter = _player; 
    });

    await Future.delayed(const Duration(milliseconds: 300));

    setState(() {
      _attackingFighter = null;
      if (action == CombatAction.basic || action == CombatAction.ultimate) {
        _defendingFighter = _enemy;
      }

      final logs = BattleEngine.executeTurn(
        attacker: _player!,
        defender: _enemy!,
        action: action,
        isPlayer: true,
      );

      _combatLog.insertAll(0, logs.reversed);
      _isPlayerTurn = false;
      _round++;
    });

    await Future.delayed(const Duration(milliseconds: 400));

    setState(() {
      _defendingFighter = null;
      _isAnimating = false;
    });

    _checkWinCondition();
    
    if (_enemy!.hp > 0 && _player!.hp > 0) {
      _triggerEnemyTurn();
    }
  }

  void _triggerEnemyTurn() async {
    setState(() => _isAnimating = true);
    await Future.delayed(const Duration(seconds: 1)); 
    if (!mounted || _enemy!.hp <= 0 || _player!.hp <= 0) return;

    CombatAction enemyAction = CombatAction.basic;
    double hpPercentage = _enemy!.hp / _enemy!.maxHp;

    if (hpPercentage < 0.4 && _enemy!.energy >= 2) {
      enemyAction = CombatAction.heal;
    } else if (_enemy!.energy >= 5 && _enemy!.damageMultiplier == 1.0) {
      enemyAction = CombatAction.buff;
    } else if (_enemy!.ultimateCooldown == 0 && _enemy!.energy >= 3) {
      enemyAction = CombatAction.ultimate;
    } else if (_enemy!.shield == 0 && _enemy!.energy >= 1) {
      enemyAction = CombatAction.shield;
    }

    setState(() => _attackingFighter = _enemy);
    await Future.delayed(const Duration(milliseconds: 300));

    setState(() {
      _attackingFighter = null;
      if (enemyAction == CombatAction.basic || enemyAction == CombatAction.ultimate) {
        _defendingFighter = _player;
      }
      
      final logs = BattleEngine.executeTurn(
        attacker: _enemy!,
        defender: _player!,
        action: enemyAction,
        isPlayer: false,
      );

      _combatLog.insertAll(0, logs.reversed);
      _isPlayerTurn = true;
    });

    await Future.delayed(const Duration(milliseconds: 400));

    setState(() {
      _defendingFighter = null;
      _isAnimating = false;
    });

    _checkWinCondition();
  }

  void _checkWinCondition() async {
    if ((_player!.hp <= 0 || _enemy!.hp <= 0) && !_matchSaved) {
      _matchSaved = true; 
      bool playerWon = _player!.hp > 0;
      
      setState(() {
        _combatLog.insert(0, playerWon ? '🏆 VICTORY!' : '💀 DEFEAT...');
      });

      final record = BattleRecord(
        playerHero: _player!.hero.name,
        aiHero: _enemy!.hero.name,
        playerWon: playerWon,
        roundsPlayed: _round,
        playedAt: DateTime.now().toIso8601String(),
      );

      await context.read<BattleProvider>().saveBattleRecord(record);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('1v1 Tactical Arena')),
      body: _isInCombat ? _buildActiveCombat() : _buildSetupPhase(),
    );
  }

  Widget _buildSetupPhase() {
    final deck = context.watch<DeckProvider>().deck;
    final tier = context.watch<DeckProvider>().matchmakingTier;

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.flash_on, size: 80, color: Colors.amber),
          const SizedBox(height: 16),
          Text('Ranked Tier: $tier', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blueGrey)),
          const SizedBox(height: 24),
          const Text('Select your Fighter', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          DropdownButtonFormField<HeroModel>(
            decoration: const InputDecoration(border: OutlineInputBorder()),
            hint: const Text('Pick a hero from your Deck'),
            value: _selectedHero,
            items: deck.map((h) => DropdownMenuItem(value: h, child: Text(h.name))).toList(),
            onChanged: (val) => setState(() => _selectedHero = val),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: (_selectedHero != null && !_isSearching) ? _startCombatPhase : null,
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 60),
              backgroundColor: Colors.red.shade700,
              foregroundColor: Colors.white,
            ),
            child: _isSearching 
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text('ENTER MATCHMAKING', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }

  Widget _buildActiveCombat() {
    bool isGameOver = _player!.hp <= 0 || _enemy!.hp <= 0;

    return Column(
      children: [
        Container(
          height: 180,
          color: Colors.red.withOpacity(0.05),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: _buildFighterCard(_enemy!, false),
        ),
        Expanded(
          child: ListView.builder(
            reverse: true, 
            padding: const EdgeInsets.all(16),
            itemCount: _combatLog.length,
            itemBuilder: (context, index) {
              String msg = _combatLog[index];
              bool isPlayerMsg = msg.startsWith('🟢');
              bool isEnemyMsg = msg.startsWith('🔴');
              bool isSystemMsg = !isPlayerMsg && !isEnemyMsg;

              return Align(
                alignment: isSystemMsg ? Alignment.center : (isPlayerMsg ? Alignment.centerRight : Alignment.centerLeft),
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSystemMsg ? Colors.grey.withOpacity(0.2) : (isPlayerMsg ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2)),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isSystemMsg ? Colors.grey : (isPlayerMsg ? Colors.green : Colors.red), width: 1),
                  ),
                  child: Text(msg.replaceAll('🟢 ', '').replaceAll('🔴 ', ''), 
                    style: const TextStyle(fontSize: 13)
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          height: 180,
          color: Colors.green.withOpacity(0.05),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: _buildFighterCard(_player!, true),
        ),
        Container(
          padding: const EdgeInsets.all(8),
          color: Theme.of(context).colorScheme.surface,
          child: isGameOver
              ? ElevatedButton(
                  onPressed: () => setState(() => _isInCombat = false),
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                  child: const Text('LEAVE ARENA'),
                )
              : Column(
                  children: [
                    Row(
                      children: [
                        _buildActionButton('ATTACK', 1, CombatAction.basic, Colors.grey.shade700),
                        const SizedBox(width: 4),
                        _buildActionButton('BUFF', 2, CombatAction.buff, Colors.orange.shade900),
                        const SizedBox(width: 4),
                        _buildActionButton('ULT', 3, CombatAction.ultimate, Colors.purple.shade700),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        _buildActionButton('SHIELD', 1, CombatAction.shield, Colors.blue.shade700),
                        const SizedBox(width: 4),
                        _buildActionButton('HEAL', 2, CombatAction.heal, Colors.green.shade700),
                      ],
                    ),
                  ],
                ),
        ),
      ],
    );
  }

  Widget _buildActionButton(String label, int energy, CombatAction action, Color color) {
    bool canUse = _isPlayerTurn && _player!.energy >= energy && !_isAnimating;
    if (action == CombatAction.ultimate && _player!.ultimateCooldown > 0) canUse = false;

    return Expanded(
      child: ElevatedButton(
        onPressed: canUse ? () => _playerAction(action) : null,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 12),
          backgroundColor: color,
          foregroundColor: Colors.white,
          disabledBackgroundColor: color.withOpacity(0.2),
        ),
        child: Text(
          action == CombatAction.ultimate && _player!.ultimateCooldown > 0 
              ? 'CD(${_player!.ultimateCooldown})' 
              : '$label (${energy}⚡)', 
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildFighterCard(Fighter f, bool isPlayerTeam) {
    bool isDead = f.hp <= 0;
    bool isAttacking = _attackingFighter == f;
    bool isDefending = _defendingFighter == f;

    double translateY = 0;
    if (isAttacking) translateY = isPlayerTeam ? -30 : 30;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      transform: Matrix4.translationValues(0, translateY, 0),
      width: 120, 
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isPlayerTeam ? Colors.green : Colors.red, width: 2),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Stack(
          children: [
            Positioned.fill(
              child: f.hero.imageUrl.isNotEmpty
                  ? Image.network(
                      f.hero.imageUrl, 
                      fit: BoxFit.cover,
                      // FIX: Bypass 403 Forbidden
                      headers: const {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                      },
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: Colors.grey.shade900,
                        child: const Icon(Icons.broken_image, color: Colors.white24, size: 40),
                      ),
                    )
                  : Container(color: Colors.grey.shade800),
            ),
            if (isDefending) Positioned.fill(child: Container(color: Colors.red.withOpacity(0.6))),
            Positioned(
              bottom: 0, left: 0, right: 0, height: 70,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter, end: Alignment.topCenter,
                    colors: [Colors.black87, Colors.transparent],
                  ),
                ),
              ),
            ),
            if (!isDead)
              Positioned(top: 4, right: 4, child: _badge('${f.energy}⚡')),
            if (!isDead)
              Positioned(top: 4, left: 4, child: Row(children: [
                if (f.status != StatusEffect.none) _badge('⚠️'),
                if (f.damageMultiplier > 1.0) _badge('❤️‍🔥'),
              ])),
            Positioned(
              bottom: 6, left: 6, right: 6,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(f.hero.name, maxLines: 1, overflow: TextOverflow.ellipsis, 
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                  if (f.shield > 0)
                    Text('🛡️ ${f.shield}', style: const TextStyle(fontSize: 10, color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  LinearProgressIndicator(
                    value: (f.hp / f.maxHp).clamp(0, 1), 
                    backgroundColor: Colors.white24, 
                    color: isPlayerTeam ? Colors.greenAccent : Colors.redAccent, 
                    minHeight: 6
                  ),
                ],
              ),
            ),
            if (isDead)
              Positioned.fill(
                child: Container(
                  color: Colors.black87,
                  child: const Center(child: Icon(Icons.close, color: Colors.red, size: 60)),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _badge(String t) => Container(
    margin: const EdgeInsets.only(right: 2),
    padding: const EdgeInsets.all(4),
    decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(4)),
    child: Text(t, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
  );
}
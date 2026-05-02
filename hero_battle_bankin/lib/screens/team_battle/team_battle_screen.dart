import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../models/battle_record.dart';
import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart';
import '../../engine/battle_engine.dart';
import '../../services/superhero_api_service.dart';

class TeamBattleScreen extends StatefulWidget {
  const TeamBattleScreen({super.key});

  @override
  State<TeamBattleScreen> createState() => _TeamBattleScreenState();
}

class _TeamBattleScreenState extends State<TeamBattleScreen> {
  bool _isLoading = false;
  bool _isInCombat = false;
  bool _matchFinished = false;
  bool _isAnimating = false; 
  
  List<Fighter> _playerTeam = [];
  List<Fighter> _enemyTeam = [];
  List<String> _combatLog = [];
  
  List<Fighter> _turnOrder = [];
  int _activeTurnIndex = 0;
  Fighter? _selectedTarget;
  int _round = 1;

  Fighter? _attackingFighter;
  Fighter? _defendingFighter;

  // Lobby State
  int _selectedLobbyLimit = 1000; 

  final int _hpMultiplier = 10;

  Fighter? get _activeFighter => 
      (_turnOrder.isNotEmpty && _activeTurnIndex < _turnOrder.length) 
          ? _turnOrder[_activeTurnIndex] 
          : null;

  bool get _isPlayerTurn => 
      _activeFighter != null && _playerTeam.contains(_activeFighter);

  void _startTeamFight() async {
    final deckProv = context.read<DeckProvider>();
    
    // Safety check: Ensure user hasn't bypassed UI to enter illegal lobby
    if (!deckProv.isEligible(_selectedLobbyLimit)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('⚠️ Team Power exceeds this Lobby Limit!'))
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _combatLog = ['Summoning Tier-Matched Enemies...'];
    });

    try {
      final api = SuperheroApiService(apiToken: '7905a60ab03c8c9260b99f2c57de7d16');
      List<Fighter> enemies = [];
      for (int i = 0; i < 5; i++) {
        final hero = await api.fetchHero(Random().nextInt(731) + 1);
        enemies.add(Fighter(hero: hero, multiplier: _hpMultiplier));
      }

      setState(() {
        _playerTeam = deckProv.deck.map((h) => Fighter(hero: h, multiplier: _hpMultiplier)).toList();
        _enemyTeam = enemies;
        _isLoading = false;
        _isInCombat = true;
        _combatLog = ['⚔️ $_selectedLobbyLimit PWR LOBBY: BATTLE START!'];
      });

      _startNewRound();
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error finding opponents.')));
    }
  }

  void _startNewRound() {
    setState(() {
      _combatLog.insert(0, '🔄 --- ROUND $_round ---');
      _turnOrder = [..._playerTeam, ..._enemyTeam]
          .where((f) => f.hp > 0).toList()
          ..sort((a, b) => b.hero.initiative.compareTo(a.hero.initiative));
      _activeTurnIndex = 0;
    });
    _processTurn();
  }

  void _processTurn() {
    if (_checkWinCondition()) return;

    if (_activeTurnIndex >= _turnOrder.length) {
      _round++;
      _startNewRound();
      return;
    }

    if (_activeFighter!.hp <= 0) {
      _advanceTurn();
      return;
    }

    if (!_isPlayerTurn) {
      _triggerEnemyAI();
    } else {
      _ensureValidTarget();
    }
  }

  void _ensureValidTarget() {
    if (_selectedTarget == null || _selectedTarget!.hp <= 0) {
      setState(() {
        _selectedTarget = _enemyTeam.firstWhere((f) => f.hp > 0, orElse: () => _enemyTeam.first);
      });
    }
  }

  void _advanceTurn() {
    setState(() => _activeTurnIndex++);
    _processTurn();
  }

  void _playerAction(CombatAction action) async {
    if (!_isPlayerTurn || _activeFighter == null || _selectedTarget == null || _isAnimating) return;

    Fighter attacker = _activeFighter!;
    Fighter target = _selectedTarget!;

    setState(() {
      _isAnimating = true;
      _attackingFighter = attacker; 
    });

    await Future.delayed(const Duration(milliseconds: 300)); 

    setState(() {
      _attackingFighter = null; 
      if (action == CombatAction.basic || action == CombatAction.ultimate) {
        _defendingFighter = target;
      }
      
      final logs = BattleEngine.executeTurn(
        attacker: attacker,
        defender: target,
        action: action,
        isPlayer: true,
      );
      _combatLog.insertAll(0, logs.reversed);
    });

    await Future.delayed(const Duration(milliseconds: 400)); 

    setState(() {
      _defendingFighter = null;
      _isAnimating = false;
    });

    _advanceTurn();
  }

  void _triggerEnemyAI() async {
    setState(() => _isAnimating = true);
    await Future.delayed(const Duration(seconds: 1)); 
    if (!mounted || _activeFighter == null || _activeFighter!.hp <= 0) return;

    List<Fighter> alivePlayers = _playerTeam.where((f) => f.hp > 0).toList();
    if (alivePlayers.isEmpty) return;

    Fighter target;
    if (_activeFighter!.hero.role.contains('Assassin')) {
      alivePlayers.sort((a, b) => a.hp.compareTo(b.hp));
      target = alivePlayers.first; 
    } else {
      var tanks = alivePlayers.where((f) => f.hero.role.contains('Tank')).toList();
      target = tanks.isNotEmpty ? tanks[Random().nextInt(tanks.length)] : alivePlayers[Random().nextInt(alivePlayers.length)];
    }

    CombatAction action = CombatAction.basic;
    double hpPerc = _activeFighter!.hp / _activeFighter!.maxHp;

    if (hpPerc < 0.3 && _activeFighter!.energy >= 2) {
      action = CombatAction.heal;
    } else if (_activeFighter!.energy >= 5 && _activeFighter!.damageMultiplier == 1.0) {
      action = CombatAction.buff;
    } else if (_activeFighter!.energy >= 3 && _activeFighter!.ultimateCooldown == 0) {
      action = CombatAction.ultimate;
    } else if (_activeFighter!.shield == 0 && _activeFighter!.energy >= 1) {
      action = CombatAction.shield;
    }

    Fighter attacker = _activeFighter!;

    setState(() => _attackingFighter = attacker); 
    await Future.delayed(const Duration(milliseconds: 300));

    setState(() {
      _attackingFighter = null;
      if (action == CombatAction.basic || action == CombatAction.ultimate) {
        _defendingFighter = target;
      }
      
      final logs = BattleEngine.executeTurn(
        attacker: attacker,
        defender: target,
        action: action,
        isPlayer: false,
      );
      _combatLog.insertAll(0, logs.reversed);
    });

    await Future.delayed(const Duration(milliseconds: 400));

    setState(() {
      _defendingFighter = null;
      _isAnimating = false;
    });

    _advanceTurn();
  }

  bool _checkWinCondition() {
    if (_matchFinished) return true;

    bool playerAlive = _playerTeam.any((f) => f.hp > 0);
    bool enemyAlive = _enemyTeam.any((f) => f.hp > 0);

    if (!playerAlive || !enemyAlive) {
      setState(() {
        _matchFinished = true;
        _combatLog.insert(0, playerAlive ? '🏆 YOUR TEAM WON THE 5v5!' : '💀 YOUR TEAM WAS WIPED OUT...');
      });

      final record = BattleRecord(
        playerHero: 'Player 5-Man Squad',
        aiHero: 'CPU 5-Man Squad',
        playerWon: playerAlive,
        roundsPlayed: _round,
        playedAt: DateTime.now().toIso8601String(),
      );
      context.read<BattleProvider>().saveBattleRecord(record);
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('5v5 Tactical Arena')),
      body: !_isInCombat ? _buildSetupPhase() : _buildCombatPhase(),
    );
  }

  Widget _buildSetupPhase() {
    final deckProv = context.watch<DeckProvider>();
    final currentPower = deckProv.totalAttackPower;
    final canEnter = deckProv.isEligible(_selectedLobbyLimit) && deckProv.deckSize == 5;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.groups, size: 80, color: Colors.blueGrey),
            const SizedBox(height: 16),
            const Text('Select Combat Lobby', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('Current Team Power: $currentPower ATK', 
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.amber.shade900)),
            const SizedBox(height: 24),
            
            // Lobby Selection Row
            _buildLobbyTile(1000, "Beginner Lobby", currentPower),
            _buildLobbyTile(2500, "Veteran Lobby", currentPower),
            _buildLobbyTile(-1, "Unlimited War", currentPower),

            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: (_isLoading || !canEnter) ? null : _startTeamFight,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 60), 
                backgroundColor: Colors.amber.shade700,
                disabledBackgroundColor: Colors.grey.shade300
              ),
              child: _isLoading 
                ? const CircularProgressIndicator(color: Colors.white) 
                : const Text('ENTER LOBBY', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            if (deckProv.deckSize < 5)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: Text('Requires a full 5-man deck', style: TextStyle(color: Colors.red, fontSize: 12)),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildLobbyTile(int limit, String title, int currentPower) {
    bool isOverLimit = limit != -1 && currentPower > limit;
    bool isSelected = _selectedLobbyLimit == limit;

    return GestureDetector(
      onTap: isOverLimit ? null : () => setState(() => _selectedLobbyLimit = limit),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isOverLimit ? Colors.grey.shade100 : (isSelected ? Colors.amber.withOpacity(0.1) : Colors.white),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isOverLimit ? Colors.grey.shade300 : (isSelected ? Colors.amber.shade700 : Colors.grey.shade400),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: isOverLimit ? Colors.grey : Colors.black87)),
                Text(limit == -1 ? "No restrictions" : "Limit: $limit ATK", 
                  style: TextStyle(fontSize: 12, color: isOverLimit ? Colors.red : Colors.grey)),
              ],
            ),
            if (isOverLimit) const Icon(Icons.lock, color: Colors.red, size: 20)
            else if (isSelected) Icon(Icons.check_circle, color: Colors.amber.shade700, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildCombatPhase() {
    return Column(
      children: [
        Container(
          color: Colors.red.withOpacity(0.05),
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
          height: 140,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: _enemyTeam.map((f) => _buildFighterCard(f, false)).toList(),
          ),
        ),
        Expanded(
          child: ListView.builder(
            reverse: true,
            padding: const EdgeInsets.all(12),
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
                    style: TextStyle(
                      fontSize: 12, 
                      fontWeight: isSystemMsg ? FontWeight.bold : FontWeight.normal,
                    )
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          color: Colors.green.withOpacity(0.05),
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
          height: 140,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: _playerTeam.map((f) => _buildFighterCard(f, true)).toList(),
          ),
        ),
        _buildActionController(),
      ],
    );
  }

  Widget _buildFighterCard(Fighter f, bool isPlayerTeam) {
    bool isDead = f.hp <= 0;
    bool isActiveTurn = _activeFighter == f;
    bool isTargeted = _selectedTarget == f;
    bool isAttacking = _attackingFighter == f;
    bool isDefending = _defendingFighter == f;

    double translateY = 0;
    if (isAttacking) translateY = isPlayerTeam ? -20 : 20; 

    return Expanded(
      child: GestureDetector(
        onTap: (!isPlayerTeam && !isDead && _isPlayerTurn && !_isAnimating) ? () => setState(() => _selectedTarget = f) : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
          transform: Matrix4.translationValues(0, translateY, 0),
          margin: const EdgeInsets.symmetric(horizontal: 2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isActiveTurn ? Colors.amberAccent : (isTargeted && !isPlayerTeam ? Colors.redAccent : Colors.grey.shade800),
              width: (isActiveTurn || isTargeted) ? 3 : 1,
            ),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Stack(
              children: [
                Positioned.fill(
                  child: f.hero.imageUrl.isNotEmpty
                      ? Image.network(f.hero.imageUrl, fit: BoxFit.cover)
                      : Container(color: Colors.grey.shade800),
                ),
                if (isDefending) Positioned.fill(child: Container(color: Colors.red.withOpacity(0.6))),
                if (!isDead)
                  Positioned(
                    top: 2, left: 2, right: 2,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            if (f.damageMultiplier > 1.0) _badge('❤️‍🔥'),
                            if (f.status != StatusEffect.none) _badge('⚠️'),
                          ],
                        ),
                        _badge('${f.energy}⚡'),
                      ],
                    ),
                  ),

                Positioned(
                  bottom: 0, left: 0, right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    color: Colors.black87,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(f.hero.name.split(' ').first, style: const TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                        if (f.shield > 0) Text('🛡️ ${f.shield}', style: const TextStyle(fontSize: 8, color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        LinearProgressIndicator(
                          value: isDead ? 0 : (f.hp / f.maxHp).clamp(0, 1),
                          minHeight: 4,
                          backgroundColor: Colors.white12,
                          color: isPlayerTeam ? Colors.greenAccent : Colors.redAccent,
                        ),
                      ],
                    ),
                  ),
                ),
                if (isDead) Positioned.fill(child: Container(color: Colors.black54, child: const Icon(Icons.close, color: Colors.red, size: 30))),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _badge(String t) => Container(
    padding: const EdgeInsets.all(2), 
    decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(4)), 
    child: Text(t, style: const TextStyle(color: Colors.white, fontSize: 8))
  );

  Widget _buildActionController() {
    if (_matchFinished) {
      return Padding(
        padding: const EdgeInsets.all(12),
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
          child: const Text('RETURN TO BASE'),
        ),
      );
    }

    if (!_isPlayerTurn) {
      return Container(
        height: 80, width: double.infinity,
        color: Theme.of(context).colorScheme.surface,
        alignment: Alignment.center,
        child: const Text('ENEMY TURN...', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
      );
    }

    Fighter active = _activeFighter!;
    return Container(
      padding: const EdgeInsets.all(8),
      color: Theme.of(context).colorScheme.surface,
      child: Column(
        children: [
          Row(
            children: [
              _actionBtn('ATK', 1, CombatAction.basic, Colors.grey.shade700, active),
              _actionBtn('BUFF', 2, CombatAction.buff, Colors.orange.shade900, active),
              _actionBtn('ULT', 3, CombatAction.ultimate, Colors.purple.shade700, active),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              _actionBtn('SHIELD', 1, CombatAction.shield, Colors.blue.shade700, active),
              _actionBtn('HEAL', 2, CombatAction.heal, Colors.green.shade700, active),
            ],
          ),
        ],
      ),
    );
  }

  Widget _actionBtn(String label, int energy, CombatAction action, Color color, Fighter active) {
    bool canUse = active.energy >= energy && !_isAnimating;
    if (action == CombatAction.ultimate && active.ultimateCooldown > 0) canUse = false;

    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(2),
        child: ElevatedButton(
          onPressed: canUse ? () => _playerAction(action) : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: color, 
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 12)
          ),
          child: Text(
            action == CombatAction.ultimate && active.ultimateCooldown > 0 
                ? 'CD(${active.ultimateCooldown})' 
                : '$label (${energy}⚡)', 
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}


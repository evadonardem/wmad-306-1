import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/foundation.dart';
import '../../../models/hero_model.dart';
import '../../../providers/battle_provider.dart';
import '../../../providers/deck_provider.dart';
import '../../../providers/player_provider.dart';
import '../../../providers/opponent_provider.dart';
import '../../../engine/battle_engine.dart';
import '../../../services/superhero_api_service.dart';
import '../../../services/prefs_service.dart';
import '../../../widgets/hp_bar.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  List<HeroModel>? playerDeck;
  int currentHeroIndex = 0;
  HeroModel? aiOpponent;
  SuperheroApiService? _api;
  bool _initialized = false;
  bool _startBattleQueued = false;
  OpponentProvider? _opponentProvider;

  @override
  void initState() {
    super.initState();
    _initializeApi();
  }

  Future<void> _initializeApi() async {
    final prefs = PrefsService();
    final token = (await prefs.loadApiToken())?.trim() ?? '';
    if (mounted) {
      setState(() {
        _api = token.isEmpty ? null : SuperheroApiService(apiToken: token);
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      final args = ModalRoute.of(context)?.settings.arguments;
      final resolvedDeck = _resolveDeck(args);
      if (resolvedDeck.isNotEmpty) {
        playerDeck = resolvedDeck;
        _initialized = true;
        _opponentProvider = context.read<OpponentProvider>();
        _getOpponentFromCache();
        
        // Add listener to opponent provider to handle when preload finishes
        _opponentProvider!.addListener(_onOpponentProviderChanged);
      }
    }
  }

  List<HeroModel> _resolveDeck(Object? args) {
    if (args is List<HeroModel>) return args;
    if (args is List) {
      return args.whereType<HeroModel>().toList();
    }
    return context.read<DeckProvider>().deck;
  }

  void _onOpponentProviderChanged() {
    if (mounted && aiOpponent == null) {
      _getOpponentFromCache();
    }
  }

  void _getOpponentFromCache() {
    if (playerDeck == null || playerDeck!.isEmpty || _opponentProvider == null) return;
    
    try {
      final currentHero = playerDeck![currentHeroIndex];
      
      // Get random opponent (not the same as player's hero)
      aiOpponent = _opponentProvider!.getRandomOpponent(excludeId: currentHero.id);
      
      if (aiOpponent == null) {
        // Never block battle start; always fall back to local hero.
        aiOpponent = _getFallbackHero();
        _startBattle();
      } else {
        // Start battle immediately
        _startBattle();
        
        // Refill the cache in background
        if (_api != null) {
          _opponentProvider!.refillOpponent(aiOpponent!, _api!);
        }
      }
    } catch (e) {
      // If OpponentProvider is unavailable, still start with local fallback.
      aiOpponent = _getFallbackHero();
      _startBattle();
    }
  }

  HeroModel _getFallbackHero() {
    // Create a decent fallback hero if API fails
    return HeroModel(
      id: '999',
      name: 'Mystery Hero',
      imageUrl: '',
      powerStats: const PowerStats(
        intelligence: 70,
        strength: 70,
        speed: 70,
        durability: 70,
        power: 70,
        combat: 70,
      ),
      publisher: 'Unknown',
      alignment: 'neutral',
      fullName: 'Mysterious Challenger',
    );
  }

  void _startBattle() {
    if (!mounted || aiOpponent == null || playerDeck == null || playerDeck!.isEmpty) {
      return;
    }
    if (_startBattleQueued) return;

    _startBattleQueued = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startBattleQueued = false;
      if (!mounted || aiOpponent == null || playerDeck == null || playerDeck!.isEmpty) {
        return;
      }

      final battle = context.read<BattleProvider>();
      if (battle.state != BattleState.idle) return;

      battle.startBattle(
        playerDeck![currentHeroIndex],
        aiOpponent!,
      );
    });
  }

  @override
  void dispose() {
    _opponentProvider?.removeListener(_onOpponentProviderChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final rawPlayerName = context.watch<PlayerProvider>().playerName;
    final playerName = rawPlayerName.trim().isEmpty ? 'Player' : rawPlayerName.trim();
    final isDark = theme.brightness == Brightness.dark;
    final bgTop = isDark ? const Color(0xFF111A2D) : const Color(0xFFF1F5FF);
    final bgBottom = isDark ? const Color(0xFF0A0F1D) : const Color(0xFFE6ECFA);
    final scaffoldBg = isDark ? const Color(0xFF0C1220) : const Color(0xFFF6F8FF);
    final primaryText = isDark ? Colors.white : const Color(0xFF1F2937);
    final mutedText = isDark ? const Color(0xFF9AA7C7) : const Color(0xFF5B6B89);
    final chipBg = isDark
      ? const Color(0x22FFFFFF)
      : const Color(0x99FFFFFF);
    final chipBorder = isDark
      ? const Color(0x33FFFFFF)
      : const Color(0x1A1F2937);
    final logPanelBg = isDark
      ? const Color(0xAA101829)
      : const Color(0xCCFFFFFF);
    final surfaceBorder = isDark
      ? const Color(0x33FFFFFF)
      : const Color(0x1F1F2937);

    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'ARENA NEXUS',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            color: primaryText,
          ),
        ),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.home_rounded),
            onPressed: () {
              context.read<BattleProvider>().resetBattle();
              Navigator.popUntil(context, (route) => route.isFirst);
            },
          ),
        ],
      ),
      body: aiOpponent == null
          ? Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [bgTop, bgBottom],
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: Color(0xFF7DE2D1)),
                    const SizedBox(height: 24),
                    Text(
                      'SUMMONING OPPONENT',
                      style: TextStyle(
                        color: primaryText,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 1500.ms),
                    const SizedBox(height: 8),
                    Text(
                      'Calibrating multiverse battleground',
                      style: TextStyle(color: mutedText, fontSize: 12),
                    ),
                  ],
                ),
              ),
            )
          : Consumer<BattleProvider>(
              builder: (context, battle, _) {
                if (battle.state == BattleState.idle) {
                  return const Center(
                    child: CircularProgressIndicator(color: Color(0xFF7DE2D1)),
                  );
                }

                final engine = battle.engine!;
                final aiImageUrl = engine.aiHero.reliableImageUrl;
                final playerImageUrl = engine.playerHero.reliableImageUrl;
                final playerHeroName = engine.playerHero.name;
                final opponentName = engine.aiHero.name.isEmpty
                  ? 'Random Opponent'
                  : engine.aiHero.name;
                final playerWon = battle.winner == playerHeroName;

                return Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [bgTop, bgBottom],
                    ),
                  ),
                  child: Stack(
                    children: [
                      // Background Decorative Elements
                      Positioned(
                        top: -40,
                        right: -40,
                        child: _buildBlurCircle(180, const Color(0x1545F3FF)),
                      ),
                      Positioned(
                        bottom: -60,
                        left: -60,
                        child: _buildBlurCircle(220, const Color(0x15FF7A59)),
                      ),
                      
                      SafeArea(
                        child: Column(
                          children: [
                            // Header Status
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                              child: Row(
                                children: [
                                  _buildHeaderChip('Round ${engine.round}', chipBg, chipBorder, primaryText),
                                  const Spacer(),
                                  _buildTurnIndicator(battle, primaryText),
                                ],
                              ),
                            ),
                            
                            // Player Names
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                              child: Row(
                                children: [
                                  _buildNameTag(playerName, const Color(0x2257CCFF), const Color(0x8057CCFF), primaryText, false),
                                  const SizedBox(width: 10),
                                  _buildNameTag(opponentName, const Color(0x22FF6B6B), const Color(0x80FF6B6B), primaryText, true),
                                ],
                              ),
                            ),
                            
                            // Main Battle Arena
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                child: LayoutBuilder(
                                  builder: (context, constraints) {
                                    final wide = constraints.maxWidth > 760;
                                    if (wide) {
                                      return Row(
                                        children: [
                                          Expanded(
                                            child: _buildHeroPanel(
                                              hero: engine.aiHero,
                                              currentHp: engine.aiCurrentHp,
                                              imageUrl: aiImageUrl,
                                              accent: const Color(0xFFFF6B6B),
                                              isPlayer: false,
                                              panelColor: logPanelBg,
                                            ),
                                          ),
                                          const SizedBox(width: 14),
                                          Expanded(
                                            child: _buildHeroPanel(
                                              hero: engine.playerHero,
                                              currentHp: engine.playerCurrentHp,
                                              imageUrl: playerImageUrl,
                                              accent: const Color(0xFF57CCFF),
                                              isPlayer: true,
                                              panelColor: logPanelBg,
                                            ),
                                          ),
                                        ],
                                      );
                                    }

                                    return Column(
                                      children: [
                                        Expanded(
                                          child: SingleChildScrollView(
                                            child: Column(
                                              children: [
                                                _buildHeroPanel(
                                                  hero: engine.playerHero,
                                                  currentHp: engine.playerCurrentHp,
                                                  imageUrl: playerImageUrl,
                                                  accent: const Color(0xFF57CCFF),
                                                  isPlayer: true,
                                                  panelColor: logPanelBg,
                                                ),
                                                Padding(
                                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                                  child: Text(
                                                    'VS',
                                                    style: TextStyle(
                                                      color: primaryText,
                                                      fontWeight: FontWeight.w900,
                                                      fontSize: 24,
                                                      letterSpacing: 2,
                                                    ),
                                                  ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.1, 1.1), duration: 1.seconds),
                                                ),
                                                _buildHeroPanel(
                                                  hero: engine.aiHero,
                                                  currentHp: engine.aiCurrentHp,
                                                  imageUrl: aiImageUrl,
                                                  accent: const Color(0xFFFF6B6B),
                                                  isPlayer: false,
                                                  panelColor: logPanelBg,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ),
                            ),
                            
                            // Battle Logs
                            Container(
                              margin: const EdgeInsets.fromLTRB(14, 10, 14, 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: logPanelBg,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: surfaceBorder),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: SizedBox(
                                height: 94,
                                child: ListView.builder(
                                  reverse: true,
                                  itemCount: battle.turnHistory.length,
                                  itemBuilder: (context, i) {
                                    final turn = battle.turnHistory.reversed.toList()[i];
                                    final isPlayerAction =
                                        turn.actor == engine.playerHero.name;
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 3),
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 6,
                                            height: 6,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: isPlayerAction ? const Color(0xFF48E5C2) : const Color(0xFFFF8A7A),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              '${turn.actor} used ${_getActionName(turn.action)} - ${turn.damage} dmg (${turn.remainingHp} HP)',
                                              style: TextStyle(
                                                color: isPlayerAction
                                                    ? const Color(0xFFA7F3D0)
                                                    : const Color(0xFFFECACA),
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ).animate().fadeIn(duration: 250.ms),
                            
                            // Action Buttons
                            if (battle.state == BattleState.active && battle.isPlayerTurn)
                              Padding(
                                padding: const EdgeInsets.fromLTRB(14, 4, 14, 14),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: _buildActionButton(
                                        icon: Icons.bolt,
                                        label: 'Attack',
                                        color: const Color(0xFFFF8A3D),
                                        onPressed: () =>
                                            battle.playerAction(BattleAction.attack),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: _buildActionButton(
                                        icon: Icons.auto_awesome,
                                        label: 'Arcane',
                                        color: const Color(0xFF8B5CF6),
                                        onPressed: () => battle
                                            .playerAction(BattleAction.specialAttack),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: _buildActionButton(
                                        icon: Icons.shield_moon,
                                        label: 'Guard',
                                        color: const Color(0xFF2CB1BC),
                                        onPressed: () =>
                                            battle.playerAction(BattleAction.defend),
                                      ),
                                    ),
                                  ],
                                ).animate().fadeIn().slideY(begin: 0.2, end: 0),
                              ),
                            
                            if (battle.state == BattleState.active && !battle.isPlayerTurn)
                              Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.grey)),
                                    const SizedBox(width: 10),
                                    Text(
                                      'Opponent is calculating next move...',
                                      style: TextStyle(color: mutedText, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            
                            // Victory/Defeat Panel
                            if (battle.state == BattleState.finished)
                              Container(
                                width: double.infinity,
                                margin: const EdgeInsets.fromLTRB(14, 6, 14, 14),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: playerWon
                                      ? const Color(0xFF13372B)
                                      : const Color(0xFF3D1B24),
                                  borderRadius: BorderRadius.circular(22),
                                  border: Border.all(
                                    color: playerWon
                                        ? const Color(0xFF2DCC8B)
                                        : const Color(0xFFED6A8A),
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: (playerWon ? const Color(0xFF2DCC8B) : const Color(0xFFED6A8A)).withValues(alpha: 0.2),
                                      blurRadius: 15,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    Icon(
                                      playerWon ? Icons.emoji_events_rounded : Icons.heart_broken_rounded,
                                      color: playerWon ? const Color(0xFF86E7BF) : const Color(0xFFFFA7BD),
                                      size: 40,
                                    ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(duration: 1.seconds),
                                    const SizedBox(height: 8),
                                    Text(
                                      playerWon
                                          ? 'VICTORY'
                                          : 'DEFEAT',
                                      style: TextStyle(
                                        color: playerWon
                                            ? const Color(0xFF86E7BF)
                                            : const Color(0xFFFFA7BD),
                                        fontSize: 18,
                                        letterSpacing: 1.2,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      playerWon
                                          ? '$playerName defeated $opponentName in ${engine.round} rounds'
                                          : '$opponentName defeated $playerName in ${engine.round} rounds',
                                      style: TextStyle(color: mutedText, fontSize: 13),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Expanded(
                                          child: ElevatedButton.icon(
                                            onPressed: () {
                                              context.read<BattleProvider>().resetBattle();
                                              if (playerDeck != null &&
                                                  currentHeroIndex + 1 < playerDeck!.length) {
                                                setState(() {
                                                  currentHeroIndex++;
                                                  aiOpponent = null;
                                                });
                                                _getOpponentFromCache();
                                              } else {
                                                if (playerWon) {
                                                  context.read<PlayerProvider>().incrementWins();
                                                }
                                                Navigator.pop(context);
                                              }
                                            },
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: playerWon ? const Color(0xFF2DCC8B) : const Color(0xFFED6A8A),
                                              foregroundColor: Colors.white,
                                              padding: const EdgeInsets.symmetric(vertical: 14),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                            ),
                                            icon: Icon(
                                              playerDeck != null &&
                                                      currentHeroIndex + 1 < playerDeck!.length
                                                  ? Icons.arrow_forward
                                                  : Icons.home,
                                            ),
                                            label: Text(
                                              playerDeck != null &&
                                                      currentHeroIndex + 1 < playerDeck!.length
                                                  ? 'Next Hero'
                                                  : 'Finish',
                                              style: const TextStyle(fontWeight: FontWeight.w800),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        OutlinedButton.icon(
                                          onPressed: () {
                                            context.read<BattleProvider>().resetBattle();
                                            Navigator.pop(context);
                                          },
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: theme.colorScheme.onSurface,
                                            side: BorderSide(color: mutedText),
                                            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          ),
                                          icon: const Icon(Icons.exit_to_app),
                                          label: const Text('Exit'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ).animate().fadeIn(duration: 450.ms).slideY(begin: 0.2, end: 0),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }

  Widget _buildBlurCircle(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, color.withValues(alpha: 0)],
        ),
      ),
    ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.3, 1.3), duration: 3.seconds);
  }

  Widget _buildHeaderChip(String text, Color bg, Color border, Color textColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: border),
      ),
      child: Text(
        text,
        style: TextStyle(color: textColor, fontWeight: FontWeight.w700),
      ),
    );
  }

  Widget _buildTurnIndicator(BattleProvider battle, Color textColor) {
    final isPlayer = battle.isPlayerTurn;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isPlayer ? const Color(0x2248E5C2) : const Color(0x22FF8A7A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: (isPlayer ? const Color(0xFF48E5C2) : const Color(0xFFFF8A7A)).withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isPlayer ? const Color(0xFF48E5C2) : const Color(0xFFFF8A7A),
            ),
          ).animate(onPlay: (c) => c.repeat()).scale(begin: const Offset(0.8, 0.8), end: const Offset(1.2, 1.2), duration: 600.ms),
          const SizedBox(width: 8),
          Text(
            battle.state == BattleState.finished
                ? 'Battle Over'
                : isPlayer ? 'Your Turn' : 'Enemy Turn',
            style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  Widget _buildNameTag(String name, Color bg, Color border, Color textColor, bool isRight) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: border),
        ),
        child: Text(
          name,
          textAlign: isRight ? TextAlign.right : TextAlign.left,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(color: textColor, fontWeight: FontWeight.w800, fontSize: 13),
        ),
      ),
    );
  }

  Widget _buildHeroPanel({
    required HeroModel hero,
    required int currentHp,
    required String imageUrl,
    required Color accent,
    required bool isPlayer,
    required Color panelColor,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final titleColor = isDark ? Colors.white : const Color(0xFF1F2937);
    final subtitleColor = isDark ? const Color(0xFF9AA7C7) : const Color(0xFF5B6B89);
    final badgeTextColor = isDark ? Colors.white : const Color(0xFF111827);
    final placeholderBg = isDark ? const Color(0xFF1B263D) : const Color(0xFFE7ECF9);
    final placeholderIcon = isDark ? const Color(0xFF9AA7C7) : const Color(0xFF67758F);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: panelColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: accent.withValues(alpha: 0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: accent.withValues(alpha: 0.05),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Row(
        children: [
          Hero(
            tag: isPlayer ? 'battle_player_${hero.id}' : 'battle_ai_${hero.id}',
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: accent, width: 2.5),
                boxShadow: [
                  BoxShadow(color: accent.withValues(alpha: 0.2), blurRadius: 8),
                ],
              ),
              child: ClipOval(
                child: imageUrl.isNotEmpty
                    ? (kIsWeb
                        ? Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            alignment: const Alignment(0, -0.28),
                            filterQuality: FilterQuality.high,
                            errorBuilder: (context, error, stackTrace) => Icon(
                              Icons.person,
                              size: 34,
                              color: placeholderIcon,
                            ),
                            loadingBuilder: (context, child, progress) {
                              if (progress == null) return child;
                              return Container(
                                color: placeholderBg,
                                child: const Center(
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                ),
                              );
                            },
                          )
                        : CachedNetworkImage(
                            imageUrl: imageUrl,
                            fit: BoxFit.cover,
                            alignment: const Alignment(0, -0.28),
                            filterQuality: FilterQuality.high,
                            placeholder: (context, url) => Container(
                              color: placeholderBg,
                              child: const Center(
                                child: CircularProgressIndicator(strokeWidth: 2),
                              ),
                            ),
                            errorWidget: (context, url, error) => Icon(
                              Icons.person,
                              size: 34,
                              color: placeholderIcon,
                            ),
                          ))
                    : Icon(Icons.person, size: 34, color: placeholderIcon),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hero.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: titleColor,
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 6),
                HpBar(
                  currentHp: currentHp,
                  maxHp: hero.maxHp,
                  heroName: hero.name,
                  isPlayer: isPlayer,
                  showName: false,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: _getAlignmentColor(hero.alignment),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        hero.alignment.toUpperCase(),
                        style: TextStyle(
                          color: badgeTextColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        hero.publisher,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: subtitleColor, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 220.ms).slideY(begin: isPlayer ? 0.1 : -0.1, end: 0);
  }

  String _getActionName(BattleAction action) {
    switch (action) {
      case BattleAction.attack:
        return 'Attack';
      case BattleAction.specialAttack:
        return 'Special Attack';
      case BattleAction.defend:
        return 'Defend';
    }
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onPressed,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: isDark ? Colors.white : Colors.black87,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 4,
        shadowColor: color.withValues(alpha: 0.4),
      ),
    );
  }

  Color _getAlignmentColor(String alignment) {
    switch (alignment.toLowerCase()) {
      case 'good':
        return Colors.blue;
      case 'bad':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

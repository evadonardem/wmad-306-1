import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../engine/battle_engine.dart';
import '../../models/hero_model.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key, this.initialHero});

  final HeroDetail? initialHero;

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen>
    with SingleTickerProviderStateMixin {
  final SuperheroApiService _api = SuperheroApiService();
  final GlobalKey _rivalSearchPanelKey = GlobalKey();
  final TextEditingController _rivalSearchController = TextEditingController();
  final FocusNode _rivalSearchFocusNode = FocusNode();
  late final AnimationController _battleEffectController;

  HeroDetail? _heroA;
  HeroDetail? _heroB;
  BattleOutcome? _outcome;
  bool _isLoadingA = false;
  bool _isLoadingB = false;
  bool _isResolvingBattle = false;
  bool _isBattleStarting = false;
  bool _isSearchingRival = false;
  String? _error;
  String? _rivalSearchError;
  List<HeroSummary> _rivalSearchResults = const <HeroSummary>[];

  Future<void> _searchRivalHeroes() async {
    final query = _rivalSearchController.text.trim();
    if (query.isEmpty) {
      setState(() {
        _rivalSearchResults = const <HeroSummary>[];
        _rivalSearchError = 'Type a hero name to search for a rival.';
      });
      return;
    }

    setState(() {
      _isSearchingRival = true;
      _rivalSearchError = null;
      _error = null;
    });

    try {
      final results = await _api.searchHeroes(query);
      final heroAId = _heroA?.id;
      if (!mounted) return;
      setState(() {
        _rivalSearchResults = results
            .where((hero) => hero.id != heroAId)
            .toList(growable: false);
        _rivalSearchError = _rivalSearchResults.isEmpty
          ? 'No rivals found for "$query". Try a different hero name.'
          : null;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _rivalSearchResults = const <HeroSummary>[];
        _rivalSearchError = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() => _isSearchingRival = false);
      }
    }
  }

  Future<void> _pickRival(HeroSummary hero) async {
    setState(() {
      _isLoadingB = true;
      _error = null;
      _rivalSearchError = null;
    });

    try {
      final picked = await _api.fetchHeroDeepDive(hero.id);
      if (!mounted) return;
      setState(() {
        _heroB = picked;
        _outcome = null;
        _rivalSearchResults = const <HeroSummary>[];
      });
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _isLoadingB = false);
      }
    }
  }

  bool get _canFight {
    return _heroA != null &&
        _heroB != null &&
        !_isLoadingA &&
        !_isLoadingB &&
        !_isResolvingBattle;
  }

  Future<void> _focusRivalSearch() async {
    final panelContext = _rivalSearchPanelKey.currentContext;
    if (panelContext == null) return;

    await Scrollable.ensureVisible(
      panelContext,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      alignment: 0.15,
    );

    if (!mounted) return;
    _rivalSearchFocusNode.requestFocus();
  }

  @override
  void initState() {
    super.initState();
    _battleEffectController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _heroA = widget.initialHero;
    if (_heroA == null) {
      _rollHeroA();
    } else {
      _rollHeroB();
    }
  }

  @override
  void dispose() {
    _rivalSearchController.dispose();
    _rivalSearchFocusNode.dispose();
    _battleEffectController.dispose();
    super.dispose();
  }

  Future<void> _rollHeroA() async {
    setState(() {
      _isLoadingA = true;
      _error = null;
    });
    try {
      final hero = await _api.fetchRandomHero();
      if (!mounted) return;
      setState(() {
        _heroA = hero;
        _outcome = null;
      });
      await _rollHeroB();
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _isLoadingA = false);
      }
    }
  }

  Future<void> _rollHeroB() async {
    setState(() {
      _isLoadingB = true;
      _error = null;
    });
    try {
      HeroDetail? hero;
      for (var attempt = 0; attempt < 6; attempt++) {
        final candidate = await _api.fetchRandomHero();
        if (_heroA == null || candidate.id != _heroA!.id) {
          hero = candidate;
          break;
        }
      }
      if (!mounted) return;
      setState(() {
        _heroB = hero;
        _outcome = null;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _isLoadingB = false);
      }
    }
  }

  void _resolveBattle() {
    final heroA = _heroA;
    final heroB = _heroB;
    if (heroA == null || heroB == null || _isResolvingBattle) return;

    setState(() {
      _isResolvingBattle = true;
      _isBattleStarting = true;
      _outcome = null;
    });

    _battleEffectController.forward(from: 0);

    Future<void>.delayed(const Duration(milliseconds: 850)).then((_) {
      if (!mounted) return;
      setState(() {
        _outcome = simulateBattle(heroA, heroB);
        _isResolvingBattle = false;
        _isBattleStarting = false;
      });
      _battleEffectController.reverse(from: 1);
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: <Color>[
              scheme.primaryContainer.withValues(alpha: 0.2),
              scheme.surface,
              scheme.secondaryContainer.withValues(alpha: 0.12),
            ],
            stops: const <double>[0.0, 0.55, 1.0],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.arrow_back),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            'Battle Arena',
                            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'See how two heroes would fight, round by round, using their stat sheets.',
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: scheme.onSurface.withValues(alpha: 0.8),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                if (_error != null) _ErrorBanner(message: _error!),
                _BattleControls(
                  isLoadingA: _isLoadingA,
                  isLoadingB: _isLoadingB,
                  isResolvingBattle: _isResolvingBattle,
                  canFight: _canFight,
                  onDrawHeroA: _rollHeroA,
                  onDrawHeroB: _heroA == null ? null : _rollHeroB,
                  onSearchRival: _focusRivalSearch,
                  onFight: _resolveBattle,
                ),
                const SizedBox(height: 18),
                KeyedSubtree(
                  key: _rivalSearchPanelKey,
                  child: _RivalSearchPanel(
                    controller: _rivalSearchController,
                    focusNode: _rivalSearchFocusNode,
                    isSearching: _isSearchingRival,
                    isLoadingRival: _isLoadingB,
                    heroAName: _heroA?.name,
                    searchResults: _rivalSearchResults,
                    errorText: _rivalSearchError,
                    onSearch: _searchRivalHeroes,
                    onPickRival: _pickRival,
                  ),
                ),
                const SizedBox(height: 18),
                _BattleStage(
                  heroA: _heroA,
                  heroB: _heroB,
                  isBattleStarting: _isBattleStarting,
                  animation: _battleEffectController,
                ),
                const SizedBox(height: 18),
                if (_outcome != null) _BattleReport(outcome: _outcome!),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BattleControls extends StatelessWidget {
  const _BattleControls({
    required this.isLoadingA,
    required this.isLoadingB,
    required this.isResolvingBattle,
    required this.canFight,
    required this.onDrawHeroA,
    required this.onDrawHeroB,
    required this.onSearchRival,
    required this.onFight,
  });

  final bool isLoadingA;
  final bool isLoadingB;
  final bool isResolvingBattle;
  final bool canFight;
  final VoidCallback onDrawHeroA;
  final VoidCallback? onDrawHeroB;
  final VoidCallback onSearchRival;
  final VoidCallback onFight;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Wrap(
          spacing: 12,
          runSpacing: 12,
          children: <Widget>[
            FilledButton.icon(
              onPressed: isLoadingA ? null : onDrawHeroA,
              icon: isLoadingA
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.casino_outlined),
              label: const Text('Draw Hero A'),
            ),
            OutlinedButton.icon(
              onPressed: onDrawHeroB == null || isLoadingB ? null : onDrawHeroB,
              icon: isLoadingB
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.casino),
              label: const Text('Draw Rival'),
            ),
            OutlinedButton.icon(
              onPressed: onSearchRival,
              icon: const Icon(Icons.manage_search),
              label: const Text('Search Rival'),
            ),
            FilledButton.tonalIcon(
              onPressed: canFight ? onFight : null,
              icon: isResolvingBattle
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.bolt),
              label: Text(canFight ? 'Fight' : 'Draw both heroes first'),
            ),
          ],
        ),
      ),
    );
  }
}

class _RivalSearchPanel extends StatelessWidget {
  const _RivalSearchPanel({
    required this.controller,
    required this.focusNode,
    required this.isSearching,
    required this.isLoadingRival,
    required this.heroAName,
    required this.searchResults,
    required this.errorText,
    required this.onSearch,
    required this.onPickRival,
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final bool isSearching;
  final bool isLoadingRival;
  final String? heroAName;
  final List<HeroSummary> searchResults;
  final String? errorText;
  final Future<void> Function() onSearch;
  final Future<void> Function(HeroSummary hero) onPickRival;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                Expanded(
                  child: Text(
                    'Pick a Rival',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (heroAName != null)
                  Chip(
                    avatar: const Icon(Icons.shield, size: 18),
                    label: Text('Hero A: $heroAName'),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: <Widget>[
                Expanded(
                  child: TextField(
                    controller: controller,
                    focusNode: focusNode,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => onSearch(),
                    decoration: InputDecoration(
                      hintText: 'Search a rival hero by name',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                FilledButton.icon(
                  onPressed: isSearching ? null : onSearch,
                  icon: isSearching
                      ? const SizedBox(
                          height: 16,
                          width: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.manage_search),
                  label: const Text('Search'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Search results can be tapped to lock in a rival for the next fight.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.72),
              ),
            ),
            if (errorText != null) ...<Widget>[
              const SizedBox(height: 12),
              _MiniNotice(message: errorText!),
            ],
            if (searchResults.isNotEmpty) ...<Widget>[
              const SizedBox(height: 12),
              SizedBox(
                height: 216,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: searchResults.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final hero = searchResults[index];
                    return SizedBox(
                      width: 150,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: <Widget>[
                          Expanded(
                            child: HeroPortraitCard(
                              imageUrl: hero.imageUrl,
                              title: hero.name,
                              heroId: hero.id,
                            ),
                          ),
                          const SizedBox(height: 8),
                          FilledButton.tonalIcon(
                            onPressed: isLoadingRival ? null : () => onPickRival(hero),
                            icon: const Icon(Icons.flag),
                            label: const Text('Pick'),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _MiniNotice extends StatelessWidget {
  const _MiniNotice({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.errorContainer.withValues(alpha: 0.45),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        message,
        style: theme.textTheme.bodyMedium?.copyWith(
          color: theme.colorScheme.onErrorContainer,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _BattleStage extends StatelessWidget {
  const _BattleStage({
    required this.heroA,
    required this.heroB,
    required this.isBattleStarting,
    required this.animation,
  });

  final HeroDetail? heroA;
  final HeroDetail? heroB;
  final bool isBattleStarting;
  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        final pulse = Curves.easeOut.transform(animation.value);
        final shake = math.sin(animation.value * math.pi * 18) * (7 - (pulse * 4));
        return Transform.translate(
          offset: Offset(isBattleStarting ? shake : 0, 0),
          child: Stack(
            children: <Widget>[
              child!,
              if (isBattleStarting)
                Positioned.fill(
                  child: IgnorePointer(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          radius: 1.1,
                          colors: <Color>[
                            Colors.white.withValues(alpha: 0.28 * (1 - pulse)),
                            Colors.transparent,
                          ],
                        ),
                      ),
                      child: Stack(
                        children: <Widget>[
                          Positioned(
                            top: 10,
                            left: 18,
                            child: _SparkIcon(
                              icon: Icons.bolt,
                              angle: -0.22,
                              animationValue: animation.value,
                            ),
                          ),
                          Positioned(
                            top: 28,
                            right: 28,
                            child: _SparkIcon(
                              icon: Icons.flash_on,
                              angle: 0.18,
                              animationValue: animation.value,
                            ),
                          ),
                          Positioned(
                            bottom: 32,
                            left: 40,
                            child: _SparkIcon(
                              icon: Icons.bolt,
                              angle: 0.4,
                              animationValue: animation.value,
                            ),
                          ),
                          Positioned.fill(
                            child: IgnorePointer(
                              child: Opacity(
                                opacity: (1 - pulse).clamp(0.0, 1.0),
                                child: CustomPaint(
                                  painter: _ThunderStrikePainter(
                                    progress: animation.value,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Center(
                            child: Opacity(
                              opacity: (1 - pulse).clamp(0.0, 1.0),
                              child: Transform.scale(
                                scale: 1.05 + (1 - pulse) * 0.35,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 14,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.55),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(
                                      color: Colors.white.withValues(alpha: 0.75),
                                      width: 1.2,
                                    ),
                                    boxShadow: <BoxShadow>[
                                      BoxShadow(
                                        color: Colors.white.withValues(alpha: 0.25),
                                        blurRadius: 24,
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    'FIGHT!',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineMedium
                                        ?.copyWith(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 2.4,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth >= 920;
              final lane = <Widget>[
                Expanded(child: _FighterPanel(hero: heroA, label: 'Hero A')),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 20),
                  child: Text(
                    'VS',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                        ),
                  ),
                ),
                Expanded(child: _FighterPanel(hero: heroB, label: 'Hero B')),
              ];

              return isWide
                  ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: lane)
                  : Column(
                      children: <Widget>[
                        _FighterPanel(hero: heroA, label: 'Hero A'),
                        const SizedBox(height: 12),
                        _FighterPanel(hero: heroB, label: 'Hero B'),
                      ],
                    );
            },
          ),
        ),
      ),
    );
  }
}

class _SparkIcon extends StatelessWidget {
  const _SparkIcon({
    required this.icon,
    required this.angle,
    required this.animationValue,
  });

  final IconData icon;
  final double angle;
  final double animationValue;

  @override
  Widget build(BuildContext context) {
    final intensity = (1 - Curves.easeOut.transform(animationValue)).clamp(0.0, 1.0);
    return Transform.rotate(
      angle: angle + (animationValue * 0.15),
      child: Opacity(
        opacity: intensity,
        child: Icon(
          icon,
          size: 34 + (intensity * 14),
          color: Colors.white,
          shadows: <Shadow>[
            Shadow(
              color: Colors.yellowAccent.withValues(alpha: 0.8 * intensity),
              blurRadius: 18,
            ),
          ],
        ),
      ),
    );
  }
}

class _ThunderStrikePainter extends CustomPainter {
  const _ThunderStrikePainter({required this.progress});

  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final t = progress.clamp(0.0, 1.0);
    final intensity = (1 - Curves.easeOut.transform(t)).clamp(0.0, 1.0);
    if (intensity <= 0) return;

    final flashPulse = ((math.sin(progress * math.pi * 10) + 1) / 2) * intensity;
    final flashPaint = Paint()
      ..shader = RadialGradient(
        center: const Alignment(0, -0.2),
        radius: 0.95,
        colors: <Color>[
          Colors.white.withValues(alpha: 0.20 * flashPulse),
          Colors.lightBlueAccent.withValues(alpha: 0.10 * flashPulse),
          Colors.transparent,
        ],
      ).createShader(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, flashPaint);

    _drawBolt(
      canvas,
      size,
      startX: size.width * 0.20,
      peakY: size.height * (0.10 + (0.03 * math.sin(progress * math.pi * 7))),
      endX: size.width * 0.46,
      endY: size.height * 0.72,
      intensity: intensity,
    );

    _drawBolt(
      canvas,
      size,
      startX: size.width * 0.78,
      peakY: size.height * (0.06 + (0.02 * math.sin(progress * math.pi * 9))),
      endX: size.width * 0.56,
      endY: size.height * 0.68,
      intensity: intensity,
    );

    _drawBolt(
      canvas,
      size,
      startX: size.width * 0.52,
      peakY: size.height * 0.04,
      endX: size.width * 0.49,
      endY: size.height * 0.60,
      intensity: intensity * 0.9,
    );
  }

  void _drawBolt(
    Canvas canvas,
    Size size, {
    required double startX,
    required double peakY,
    required double endX,
    required double endY,
    required double intensity,
  }) {
    final path = Path()..moveTo(startX, peakY);

    final segmentCount = 7;
    for (var i = 1; i <= segmentCount; i++) {
      final lerp = i / segmentCount;
      final y = peakY + ((endY - peakY) * lerp);
      final baseX = startX + ((endX - startX) * lerp);
      final zig = (i.isEven ? -1 : 1) * (14 * intensity) * (1 - lerp * 0.55);
      path.lineTo(baseX + zig, y);
    }

    final outer = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..strokeWidth = 5.4 * intensity
      ..color = Colors.lightBlueAccent.withValues(alpha: 0.55 * intensity)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);

    final inner = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..strokeWidth = 2.2 * intensity
      ..color = Colors.white.withValues(alpha: 0.95 * intensity);

    canvas.drawPath(path, outer);
    canvas.drawPath(path, inner);
  }

  @override
  bool shouldRepaint(covariant _ThunderStrikePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

class _FighterPanel extends StatelessWidget {
  const _FighterPanel({required this.hero, required this.label});

  final HeroDetail? hero;
  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    if (hero == null) {
      return Container(
        height: 360,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: scheme.surfaceContainerHighest.withValues(alpha: 0.5),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(Icons.shield_outlined, size: 58, color: scheme.primary),
              const SizedBox(height: 10),
              Text(
                '$label waiting for a hero',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
            ],
          ),
        ),
      );
    }

    final topStat = _topStat(hero!);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: scheme.surface.withValues(alpha: 0.98),
        border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(
            height: 250,
            child: HeroPortraitCard(
              imageUrl: hero!.imageUrl,
              title: hero!.name,
              heroId: hero!.id,
              subtitle: 'ID #${hero!.id}',
              badge: Chip(
                label: Text(label),
                visualDensity: VisualDensity.compact,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            hero!.biography['full-name'] ?? 'Unknown identity',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            'Top stat: ${topStat.key} (${topStat.value})',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurface.withValues(alpha: 0.8),
                ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: hero!.powerstats.entries.map((entry) {
              return Chip(
                label: Text('${entry.key}: ${entry.value}'),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _BattleReport extends StatelessWidget {
  const _BattleReport({required this.outcome});

  final BattleOutcome outcome;

  @override
  Widget build(BuildContext context) {
    final winnerName = outcome.winner?.name ?? 'Draw';

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Battle Report',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: 10),
            Text(
              outcome.summary,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 12),
            Row(
              children: <Widget>[
                Expanded(
                  child: _ScorePill(
                    label: outcome.heroA.name,
                    score: outcome.heroAScore,
                    isWinner: outcome.winner?.id == outcome.heroA.id,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _ScorePill(
                    label: outcome.heroB.name,
                    score: outcome.heroBScore,
                    isWinner: outcome.winner?.id == outcome.heroB.id,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              winnerName == 'Draw' ? 'The fight is even.' : '$winnerName wins the arena.',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 10),
            ...outcome.rounds.map(
              (round) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.45),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Expanded(
                            child: Text(
                              round.label,
                              style: const TextStyle(fontWeight: FontWeight.w700),
                            ),
                          ),
                          Text(round.winner),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(round.description),
                      const SizedBox(height: 8),
                      Row(
                        children: <Widget>[
                          Expanded(child: LinearProgressIndicator(value: round.heroAScore / 100)),
                          const SizedBox(width: 12),
                          Expanded(child: LinearProgressIndicator(value: round.heroBScore / 100)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScorePill extends StatelessWidget {
  const _ScorePill({required this.label, required this.score, required this.isWinner});

  final String label;
  final int score;
  final bool isWinner;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: isWinner ? scheme.primaryContainer : scheme.surfaceContainerHighest.withValues(alpha: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Text(
            '$score',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
        ],
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.errorContainer,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        message,
        style: TextStyle(color: Theme.of(context).colorScheme.onErrorContainer),
      ),
    );
  }
}

MapEntry<String, int> _topStat(HeroDetail hero) {
  var bestKey = 'combat';
  var bestValue = 0;
  for (final entry in hero.powerstats.entries) {
    final value = int.tryParse(entry.value) ?? 0;
    if (value >= bestValue) {
      bestKey = entry.key;
      bestValue = value;
    }
  }
  return MapEntry(bestKey, bestValue);
}
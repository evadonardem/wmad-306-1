import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/hero_model.dart';
import '../../providers/deck_provider.dart';
import '../../providers/hero_search_provider.dart';
import '../../router/app_router.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static const int _pageSize = 30;

  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final SuperheroApiService _api = SuperheroApiService.fromRuntime();

  final List<HeroModel> _heroes = <HeroModel>[];
  bool _isInitialLoading = true;
  bool _isLoadingMore = false;
  bool _isSearchMode = false;
  bool _hasMore = true;
  int _nextStartId = 1;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadNextPage();
  }

  void _onScroll() {
    if (_isSearchMode || !_hasMore || _isLoadingMore) {
      return;
    }

    final position = _scrollController.position;
    if (position.pixels >= position.maxScrollExtent - 240) {
      _loadNextPage();
    }
  }

  Future<void> _loadNextPage() async {
    if (_isLoadingMore || !_hasMore || _isSearchMode) {
      return;
    }

    setState(() {
      _isLoadingMore = true;
      _errorMessage = null;
    });

    try {
      final page = await _api.fetchHeroesPage(
        startId: _nextStartId,
        count: _pageSize,
      );

      if (!mounted) return;

      setState(() {
        _heroes.addAll(page);
        _nextStartId += _pageSize;
        _hasMore = _nextStartId <= SuperheroApiService.maxHeroId;
        _isInitialLoading = false;
        _isLoadingMore = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString();
        _isInitialLoading = false;
        _isLoadingMore = false;
      });
    }
  }

  Future<void> _runSearch() async {
    final query = _searchController.text.trim();
    final provider = context.read<HeroSearchProvider>();

    if (query.isEmpty) {
      setState(() {
        _isSearchMode = false;
        _heroes.clear();
        _errorMessage = null;
        _hasMore = true;
        _nextStartId = 1;
        _isInitialLoading = true;
      });
      await _loadNextPage();
      return;
    }

    setState(() {
      _isSearchMode = true;
      _isInitialLoading = true;
      _errorMessage = null;
      _hasMore = false;
    });

    try {
      final results = await provider.search(query: query);
      if (!mounted) return;
      setState(() {
        _heroes
          ..clear()
          ..addAll(results);
        _isInitialLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = provider.errorMessage ?? e.toString();
        _isInitialLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('Hero Battle'),
        backgroundColor: theme.colorScheme.surface.withValues(alpha: 0.68),
        surfaceTintColor: Colors.transparent,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, RouteNames.profile),
          ),
          Consumer<DeckProvider>(
            builder: (context, deck, _) => Stack(
              alignment: Alignment.center,
              children: <Widget>[
                IconButton(
                  icon: const Icon(Icons.style),
                  onPressed: () =>
                      Navigator.pushNamed(context, RouteNames.deckBuilder),
                ),
                if (deck.deckSize > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: CircleAvatar(
                      radius: 8,
                      child: Text(
                        '${deck.deckSize}',
                        style: const TextStyle(fontSize: 10),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: Stack(
        children: <Widget>[
          const _GalaxyBackdrop(),
          Column(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: <Color>[
                        theme.colorScheme.surface.withValues(alpha: 0.86),
                        theme.colorScheme.surfaceContainerHigh.withValues(
                          alpha: 0.78,
                        ),
                      ],
                    ),
                    border: Border.all(
                      color: theme.colorScheme.primary.withValues(alpha: 0.34),
                    ),
                    boxShadow: <BoxShadow>[
                      BoxShadow(
                        color: theme.colorScheme.primary.withValues(
                          alpha: 0.18,
                        ),
                        blurRadius: 24,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) {
                            _runSearch();
                          },
                          decoration: InputDecoration(
                            labelText: 'Search Hero',
                            hintText:
                                'Search by hero name (leave empty to browse all)',
                            prefixIcon: const Icon(Icons.search),
                            border: const OutlineInputBorder(),
                            labelStyle: TextStyle(
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.9,
                              color: theme.colorScheme.onSurface,
                            ),
                            hintStyle: TextStyle(
                              letterSpacing: 0.7,
                              color: theme.colorScheme.onSurface.withValues(
                                alpha: 0.74,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      FilledButton.icon(
                        onPressed: () {
                          _runSearch();
                        },
                        icon: const Icon(Icons.bolt),
                        label: const Text('Search'),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(child: _buildContent()),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    if (_isInitialLoading && _heroes.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null && _heroes.isEmpty) {
      return _ErrorState(
        message: 'Error: $_errorMessage',
        onRetry: () {
          if (_isSearchMode) {
            _runSearch();
          } else {
            _loadNextPage();
          }
        },
      );
    }

    if (_heroes.isEmpty) {
      return const Center(child: Text('No heroes found.'));
    }

    final showBottomLoader = !_isSearchMode && (_isLoadingMore || _hasMore);

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = _crossAxisCountForWidth(constraints.maxWidth);

        return GridView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(16),
          itemCount: _heroes.length + (showBottomLoader ? 1 : 0),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.7,
          ),
          itemBuilder: (context, i) {
            if (i >= _heroes.length) {
              return const Center(child: CircularProgressIndicator());
            }

            final hero = _heroes[i];
            return HeroCard(
              hero: hero,
              onTap: () => Navigator.pushNamed(
                context,
                RouteNames.heroDetail,
                arguments: hero,
              ),
            );
          },
        );
      },
    );
  }

  int _crossAxisCountForWidth(double width) {
    if (width >= 1200) return 5;
    if (width >= 900) return 4;
    if (width >= 640) return 3;
    return 2;
  }
}

class _GalaxyBackdrop extends StatelessWidget {
  const _GalaxyBackdrop();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Stack(
        fit: StackFit.expand,
        children: const <Widget>[
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  Color(0xFF020611),
                  Color(0xFF120A2E),
                  Color(0xFF081A36),
                ],
              ),
            ),
          ),
          CustomPaint(painter: _StarFieldPainter()),
          _GlowOrb(
            alignment: Alignment(-0.9, -0.75),
            size: 280,
            color: Color(0xFF00D9FF),
          ),
          _GlowOrb(
            alignment: Alignment(0.92, -0.2),
            size: 360,
            color: Color(0xFF7AFF8A),
          ),
          _GlowOrb(
            alignment: Alignment(0.0, 0.9),
            size: 420,
            color: Color(0xFFFF4DD1),
          ),
        ],
      ),
    );
  }
}

class _GlowOrb extends StatelessWidget {
  const _GlowOrb({
    required this.alignment,
    required this.size,
    required this.color,
  });

  final Alignment alignment;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: alignment,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: <Color>[
              color.withValues(alpha: 0.32),
              color.withValues(alpha: 0.08),
              Colors.transparent,
            ],
          ),
        ),
      ),
    );
  }
}

class _StarFieldPainter extends CustomPainter {
  const _StarFieldPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final random = math.Random(97);
    final starPaint = Paint();

    for (var i = 0; i < 170; i++) {
      final dx = random.nextDouble() * size.width;
      final dy = random.nextDouble() * size.height;
      final radius = random.nextDouble() * 1.5 + 0.3;
      final tone = Color.lerp(
        const Color(0xFF9EDAFF),
        Colors.white,
        random.nextDouble(),
      )!;

      starPaint.color = tone.withValues(alpha: 0.2 + random.nextDouble() * 0.6);
      canvas.drawCircle(Offset(dx, dy), radius, starPaint);
    }

    final wavePath = Path()
      ..moveTo(0, size.height * 0.27)
      ..quadraticBezierTo(
        size.width * 0.38,
        size.height * 0.08,
        size.width,
        size.height * 0.38,
      );

    final wavePaint = Paint()
      ..shader = const LinearGradient(
        colors: <Color>[
          Color(0x0037F1FF),
          Color(0x8837F1FF),
          Color(0x00A78BFA),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..strokeWidth = 2.2
      ..style = PaintingStyle.stroke;

    canvas.drawPath(wavePath, wavePaint);
  }

  @override
  bool shouldRepaint(covariant _StarFieldPainter oldDelegate) => false;
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}

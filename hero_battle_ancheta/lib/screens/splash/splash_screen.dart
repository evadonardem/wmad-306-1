import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/player_provider.dart';
import '../../../providers/deck_provider.dart';
import '../../../providers/hero_search_provider.dart';
import '../../../providers/opponent_provider.dart';
import '../../../services/superhero_api_service.dart';
import '../../../services/prefs_service.dart';
import '../../../router/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late PlayerProvider _playerProvider;
  late HeroSearchProvider _heroSearchProvider;
  late DeckProvider _deckProvider;
  late OpponentProvider _opponentProvider;

  @override
  void initState() {
    super.initState();
    // Initialize providers here before _init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _playerProvider = context.read<PlayerProvider>();
      _heroSearchProvider = context.read<HeroSearchProvider>();
      _deckProvider = context.read<DeckProvider>();
      _opponentProvider = context.read<OpponentProvider>();
      _init();
    });
  }

  Future<void> _init() async {
    // Load preferences into providers before showing any screen
    await _playerProvider.loadFromPrefs();
    await _playerProvider.loadTotalWinsFromHistory();
    await _heroSearchProvider.loadLastSearch();
    await _deckProvider.loadSavedDecks();

    // Initialize API and preload opponents
    final prefs = PrefsService();
    final token = (await prefs.loadApiToken())?.trim() ?? '';
    if (token.isNotEmpty) {
      final api = SuperheroApiService(apiToken: token);
      // Start preloading opponents without waiting.
      _opponentProvider.preloadOpponents(api);
    }

    if (!mounted) return;

    // Replace splash so the user cannot pop back to it
    Navigator.pushReplacementNamed(context, RouteNames.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary,
              Theme.of(context).colorScheme.primaryContainer,
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.flash_on,
                size: 80,
                color: Colors.white,
              ),
              SizedBox(height: 20),
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
              SizedBox(height: 20),
              Text(
                'Hero Battle',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
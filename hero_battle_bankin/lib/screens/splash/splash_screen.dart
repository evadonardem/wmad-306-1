import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/player_provider.dart'; 
import '../../providers/hero_search_provider.dart';
import '../../providers/deck_provider.dart';
import '../../providers/battle_provider.dart';
import '../../router/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    try {
      final playerProv = context.read<PlayerProvider>();
      final searchProv = context.read<HeroSearchProvider>();
      final deckProv = context.read<DeckProvider>();
      final battleProv = context.read<BattleProvider>();

      // Initializing all systems from local storage
      await playerProv.loadFromPrefs(); 
      await searchProv.loadLastSearch(); 
      await deckProv.loadDeck();        
      await battleProv.loadHistory();    
      
    } catch (e) {
      debugPrint('==== SPLASH SCREEN ERROR ====');
      debugPrint(e.toString());
    }

    // Small delay to let the UI show the splash icon
    await Future.delayed(const Duration(milliseconds: 800));

    if (!mounted) return;
    Navigator.pushReplacementNamed(context, RouteNames.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shield, 
              size: 100, 
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 24),
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            const Text(
              'Initializing Hero Database...',
              style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
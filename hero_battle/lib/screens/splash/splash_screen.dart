import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/hero_search_provider.dart';
import '../../providers/deck_provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initApp();
  }

  Future<void> _initApp() async {
    try {
      // Add a timeout to prevent infinite loading
      await Future.wait([
        Provider.of<DeckProvider>(context, listen: false).loadDecks(),
        Provider.of<HeroSearchProvider>(
          context,
          listen: false,
        ).loadLastSearch(),
      ]).timeout(const Duration(seconds: 5));
    } catch (e, stack) {
      // Print error for debugging
      debugPrint('SplashScreen init error: $e\n$stack');
    }
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, '/home');
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}

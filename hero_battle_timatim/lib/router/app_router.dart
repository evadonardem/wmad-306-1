// Central named-route table with lightweight fade transition.

import 'package:flutter/material.dart';

import '../models/hero_model.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/deck_builder/deck_builder_screen.dart';
import '../screens/deck_builder/saved_decks_screen.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/splash/splash_screen.dart';

class RouteNames {
  static const String splash = '/';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String savedDecks = '/decks/saved';
  static const String battle = '/battle';
  static const String history = '/history';
  static const String profile = '/profile';
}

class AppRouter {
  static Route<T> _fadeRoute<T>({required Widget child}) {
    return PageRouteBuilder<T>(
      pageBuilder: (_, animation, __) => FadeTransition(
        opacity: animation,
        child: child,
      ),
      transitionDuration: const Duration(milliseconds: 260),
    );
  }

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return _fadeRoute(child: const SplashScreen());
      case RouteNames.home:
        return _fadeRoute(child: const HomeScreen());
      case RouteNames.heroDetail:
        final hero = settings.arguments as HeroModel;
        return _fadeRoute(child: HeroDetailScreen(hero: hero));
      case RouteNames.deckBuilder:
        return _fadeRoute(child: const DeckBuilderScreen());
      case RouteNames.savedDecks:
        return _fadeRoute(child: const SavedDecksScreen());
      case RouteNames.battle:
        return _fadeRoute(child: const BattleScreen());
      case RouteNames.history:
        return _fadeRoute(child: const HistoryScreen());
      case RouteNames.profile:
        return _fadeRoute(child: const ProfileScreen());
      default:
        return _fadeRoute(child: const HomeScreen());
    }
  }
}

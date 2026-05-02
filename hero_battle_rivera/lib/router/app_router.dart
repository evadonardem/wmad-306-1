import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/deck/deck_builder_screen.dart';
import '../screens/hero/hero_detail_screen.dart';
import '../screens/history/battle_history_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/profile/player_profile_screen.dart';
import '../screens/splash/splash_screen.dart';

class RouteNames {
  static const String splash = '/';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String battle = '/battle';
  static const String history = '/history';
  static const String profile = '/profile';
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return MaterialPageRoute(
          builder: (_) => const SplashScreen(),
          settings: settings,
        );
      case RouteNames.home:
        return MaterialPageRoute(
          builder: (_) => const HomeScreen(),
          settings: settings,
        );
      case RouteNames.heroDetail:
        final hero = settings.arguments as HeroModel;
        return MaterialPageRoute(
          builder: (_) => HeroDetailScreen(hero: hero),
          settings: settings,
        );
      case RouteNames.deckBuilder:
        return MaterialPageRoute(
          builder: (_) => const DeckBuilderScreen(),
          settings: settings,
        );
      case RouteNames.battle:
        return MaterialPageRoute(
          builder: (_) => const BattleScreen(),
          settings: settings,
        );
      case RouteNames.history:
        return MaterialPageRoute(
          builder: (_) => const BattleHistoryScreen(),
          settings: settings,
        );
      case RouteNames.profile:
        return MaterialPageRoute(
          builder: (_) => const PlayerProfileScreen(),
          settings: settings,
        );
      default:
        return MaterialPageRoute(
          builder: (_) => const HomeScreen(),
          settings: settings,
        );
    }
  }
}

// ignore_for_file: unreachable_switch_case
import 'package:flutter/material.dart';
import '../screens/home/home_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/deck_builder/deck_builder_screen.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';

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
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case RouteNames.heroDetail:
      case '/hero':
        final args = settings.arguments;
        if (args is Map && args['hero'] != null) {
          return MaterialPageRoute(
            builder: (_) => HeroDetailScreen(hero: args['hero']),
          );
        }
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Hero not found'))),
        );
      case RouteNames.deckBuilder:
      case '/deck':
        return MaterialPageRoute(builder: (_) => const DeckBuilderScreen());
      case RouteNames.battle:
      case '/battle':
        return MaterialPageRoute(builder: (_) => const BattleScreen());
      case RouteNames.history:
      case '/history':
        return MaterialPageRoute(builder: (_) => const HistoryScreen());
      case RouteNames.profile:
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Page not found'))),
        );
    }
  }
}

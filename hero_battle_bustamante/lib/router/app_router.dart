import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/deck_builder/deck_builder_screen.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/deck_battle/deck_battle_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';

class RouteNames {
  static const String splash = '/';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String battle = '/battle';
  static const String deckBattle = '/deck-battle';
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
        final hero = settings.arguments;
        if (hero is! HeroModel) {
          return MaterialPageRoute(
            builder: (_) => const Scaffold(
                body: Center(child: Text('Invalid hero data'))),
          );
        }
        return MaterialPageRoute(
            builder: (_) => HeroDetailScreen(hero: hero));
      case RouteNames.deckBuilder:
        return MaterialPageRoute(
            builder: (_) => const DeckBuilderScreen());
      case RouteNames.battle:
        final hero = settings.arguments;
        if (hero is! HeroModel) {
          return MaterialPageRoute(
            builder: (_) => const Scaffold(
                body: Center(child: Text('Invalid hero data'))),
          );
        }
        return MaterialPageRoute(
            builder: (_) => BattleScreen(playerHero: hero));
      case RouteNames.deckBattle:
        final deck = settings.arguments;
        if (deck is! List<HeroModel>) {
          return MaterialPageRoute(
            builder: (_) => const Scaffold(
                body: Center(child: Text('Invalid deck data'))),
          );
        }
        return MaterialPageRoute(
            builder: (_) => DeckBattleScreen(playerDeck: deck));
      case RouteNames.history:
        return MaterialPageRoute(builder: (_) => const HistoryScreen());
      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Route not found'))),
        );
    }
  }
}

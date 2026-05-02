import 'package:flutter/material.dart';
import '../screens/mechanics_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../models/hero_model.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/deck/deck_screen.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/player_selection_screen.dart';

class RouteNames {
  static const String playerSelection = '/player-selection';
  static const String splash = '/';
  static const String mechanics = '/mechanics';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deck = '/deck';
  static const String battle = '/battle';
  static const String history = '/history';
  static const String profile = '/profile';
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/decks':
        return MaterialPageRoute(builder: (_) => const DeckScreen());
      case RouteNames.playerSelection:
        return MaterialPageRoute(builder: (_) => const PlayerSelectionScreen());
      case RouteNames.mechanics:
        return MaterialPageRoute(builder: (_) => const MechanicsScreen());

      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());

      case RouteNames.heroDetail:
        final args = settings.arguments;

        if (args is HeroModel) {
          return MaterialPageRoute(
            builder: (_) => HeroDetailScreen(hero: args),
          );
        }

        // fallback if wrong data
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text("Invalid hero data"))),
        );

      case RouteNames.deck:
        return MaterialPageRoute(builder: (_) => const DeckScreen());

      case RouteNames.battle:
        return MaterialPageRoute(builder: (_) => const BattleScreen());

      case RouteNames.history:
        return MaterialPageRoute(builder: (_) => const HistoryScreen());

      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());

      case RouteNames.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());

      default:
        return MaterialPageRoute(builder: (_) => const MechanicsScreen());
    }
  }
}

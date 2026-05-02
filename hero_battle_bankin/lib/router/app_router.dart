import 'package:flutter/material.dart';
import '../models/hero_model.dart';

import '../screens/splash/splash_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/deck_builder/deck_builder_screen.dart'; 
import '../screens/battle/battle_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/team_battle/team_battle_screen.dart';
import '../screens/ranking/ranking_screen.dart'; // Verified Import

class RouteNames {
  static const String splash = '/';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String battle = '/battle';
  static const String history = '/history';
  static const String profile = '/profile';
  static const String teamBattle = '/teamBattle';
  static const String ranking = '/ranking'; // Verified Route Name
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case RouteNames.heroDetail:
        final hero = settings.arguments as HeroModel;
        return MaterialPageRoute(builder: (_) => HeroDetailScreen(hero: hero));
      case RouteNames.deckBuilder:
        return MaterialPageRoute(builder: (_) => const DeckBuilderScreen());
      case RouteNames.battle:
        return MaterialPageRoute(builder: (_) => const BattleScreen());
      case RouteNames.history:
        return MaterialPageRoute(builder: (_) => const HistoryScreen());
      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case RouteNames.teamBattle:
        return MaterialPageRoute(builder: (_) => const TeamBattleScreen());
      case RouteNames.ranking: 
        return MaterialPageRoute(builder: (_) => const RankingScreen()); // Linked to the class below
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('Building screen for: ${settings.name}...')),
          ),
        );
    }
  }
}
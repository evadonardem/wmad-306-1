import 'package:flutter/material.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/hero_detail/hero_detail_screen.dart';
import '../screens/deck_builder/deck_builder_screen.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../models/hero_model.dart';

class RouteNames {
  static const splash = '/';
  static const home = '/home';
  static const heroDetail = '/hero';
  static const deckBuilder = '/deck';
  static const battle = '/battle';
  static const history = '/history';
  static const profile = '/profile';
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
      default:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
    }
  }
}
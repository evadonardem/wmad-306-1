import 'package:flutter/material.dart';
import '../models/hero_model.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/home/home_screen.dart';
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

class HeroDetailArguments {
  final HeroModel hero;
  final String? initialImageUrl;

  const HeroDetailArguments({
    required this.hero,
    this.initialImageUrl,
  });
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case RouteNames.heroDetail:
        final arguments = settings.arguments;
        final hero = arguments is HeroDetailArguments
            ? arguments.hero
            : arguments as HeroModel;
        final initialImageUrl = arguments is HeroDetailArguments
            ? arguments.initialImageUrl
            : null;
        return MaterialPageRoute(
          builder: (_) => HeroDetailScreen(
            hero: hero,
            initialImageUrl: initialImageUrl,
          ),
        );
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
import 'package:flutter/material.dart';
import 'package:hero_battle/models/hero_model.dart';
import 'package:hero_battle/screens/battle/battle_screen.dart';
import 'package:hero_battle/screens/deck_builder/deck_builder_screen.dart';
import 'package:hero_battle/screens/deck_builder/saved_decks_screen.dart';
import 'package:hero_battle/screens/history/history_screen.dart';
import 'package:hero_battle/screens/home/home_screen.dart';
import 'package:hero_battle/screens/hero_detail/hero_detail_screen.dart';
import 'package:hero_battle/screens/profile/profile_screen.dart';
import 'package:hero_battle/screens/splash/splash_screen.dart';

class RouteNames {
  static const String splash = '';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String battle = '/battle';
  static const String history = '/history';
  static const String profile = '/profile';
}

class AppRouter {
  static Route<dynamic> _buildRoute(Widget child, {RouteSettings? settings}) {
    return PageRouteBuilder(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 260),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => child,
      transitionsBuilder: (_, animation, secondaryAnimation, page) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
          reverseCurve: Curves.easeInCubic,
        );

        return FadeTransition(
          opacity: Tween<double>(begin: 0.0, end: 1.0).animate(curved),
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 0.03),
              end: Offset.zero,
            ).animate(curved),
            child: page,
          ),
        );
      },
    );
  }

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return _buildRoute(const SplashScreen(), settings: settings);
      case RouteNames.home:
        return _buildRoute(const HomeScreen(), settings: settings);
      case RouteNames.heroDetail:
        final hero = settings.arguments as HeroModel?;
        return _buildRoute(
          HeroDetailScreen(
            hero:
                hero ??
                const HeroModel(
                  id: 0,
                  name: 'Unknown Hero',
                  imageUrl: '',
                  intelligence: 0,
                  strength: 0,
                  speed: 0,
                  durability: 0,
                  power: 0,
                  combat: 0,
                ),
          ),
          settings: settings,
        );
      case RouteNames.deckBuilder:
        return _buildRoute(const DeckBuilderScreen(), settings: settings);
      case RouteNames.battle:
        return _buildRoute(const BattleScreen(), settings: settings);
      case RouteNames.history:
        return _buildRoute(const HistoryScreen(), settings: settings);
      case RouteNames.profile:
        return _buildRoute(const ProfileScreen(), settings: settings);
      case '/saved-decks':
        return _buildRoute(const SavedDecksScreen(), settings: settings);
      default:
        return _buildRoute(const HomeScreen(), settings: settings);
    }
  }
}

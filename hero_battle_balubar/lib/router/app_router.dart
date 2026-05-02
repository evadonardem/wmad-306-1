import 'package:flutter/material.dart';
import '../screens/home/home_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/battle/battle_screen.dart';
import '../screens/deck/deck_builder_screen.dart';
import '../screens/deck/saved_decks_screen.dart';
import '../screens/collection/collection_screen.dart';
import '../screens/shop/shop_screen.dart';
import '../screens/leaderboard/leaderboard_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../models/hero_model.dart';

class RouteNames {
  static const String splash = '/';
  static const String home = '/home';
  static const String heroDetail = '/hero';
  static const String deckBuilder = '/deck';
  static const String savedDecks = '/saved-decks';
  static const String battle = '/battle';
  static const String rankedBattle = '/ranked-battle';
  static const String shop = '/shop';
  static const String collection = '/collection';
  static const String leaderboard = '/leaderboard';
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
        return MaterialPageRoute(builder: (_) => const Placeholder());
      case RouteNames.deckBuilder:
        return MaterialPageRoute(builder: (_) => const DeckBuilderScreen());
      case RouteNames.savedDecks:
        return MaterialPageRoute(builder: (_) => const SavedDecksScreen());
      case RouteNames.battle:
        final playerHero = settings.arguments as HeroModel?;
        return MaterialPageRoute(
          builder: (_) => BattleScreen(playerHero: playerHero),
        );
      case RouteNames.rankedBattle:
        return MaterialPageRoute(
          builder: (_) => const BattleScreen(isRanked: true),
        );
      case RouteNames.shop:
        return MaterialPageRoute(builder: (_) => const ShopScreen());
      case RouteNames.collection:
        return MaterialPageRoute(builder: (_) => const CollectionScreen());
      case RouteNames.leaderboard:
        return MaterialPageRoute(builder: (_) => const LeaderboardScreen());
      case RouteNames.history:
        return MaterialPageRoute(builder: (_) => const HistoryScreen());
      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(builder: (_) => const Placeholder());
    }
  }
}

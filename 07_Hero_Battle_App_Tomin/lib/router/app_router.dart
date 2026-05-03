import 'package:flutter/material.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/squad/squad_screen.dart';
import '../screens/saved_squads/saved_squads_screen.dart';
import '../screens/arena/arena_screen.dart';
import '../screens/warrior_detail/warrior_detail_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../models/warrior_model.dart';

abstract class Routes {
  static const splash = '/';
  static const home = '/home';
  static const squad = '/squad';
  static const savedSquads = '/saved-squads';
  static const arena = '/arena';
  static const warriorDetail = '/warrior-detail';
  static const history = '/history';
  static const profile = '/profile';
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case Routes.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case Routes.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case Routes.squad:
        return MaterialPageRoute(builder: (_) => const SquadScreen());
      case Routes.savedSquads:
        return MaterialPageRoute(builder: (_) => const SavedSquadsScreen());
      case Routes.arena:
        return MaterialPageRoute(builder: (_) => const ArenaScreen());
      case Routes.warriorDetail:
        final warrior = settings.arguments as WarriorModel;
        return MaterialPageRoute(
          builder: (_) => WarriorDetailScreen(warrior: warrior),
        );
      case Routes.history:
        return MaterialPageRoute(builder: (_) => const HistoryScreen());
      case Routes.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
    }
  }
}

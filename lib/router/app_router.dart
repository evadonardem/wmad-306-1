import 'package:flutter/material.dart';
import '../screens/home/home_screen.dart';
import '../screens/splash/splash_screen.dart';

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
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case RouteNames.heroDetail:
        return MaterialPageRoute(builder: (_) => const Placeholder());
      case RouteNames.deckBuilder:
        return MaterialPageRoute(builder: (_) => const Placeholder());
      case RouteNames.battle:
        return MaterialPageRoute(builder: (_) => const Placeholder());
      case RouteNames.history:
        return MaterialPageRoute(builder: (_) => const Placeholder());
      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const Placeholder());
      default:
        return MaterialPageRoute(builder: (_) => const Placeholder());
    }
  }
}

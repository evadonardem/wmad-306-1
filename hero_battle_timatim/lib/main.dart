// App entrypoint. Wraps the app in global providers and applies a
// centralized theme system with optional dark mode.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/battle_provider.dart';
import 'providers/deck_provider.dart';
import 'providers/hero_search_provider.dart';
import 'providers/player_provider.dart';
import 'router/app_router.dart';
import 'services/database_service.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  DatabaseService.init();
  runApp(const HeroBattleApp());
}

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(create: (_) => DeckProvider()),
        ChangeNotifierProvider(create: (_) => BattleProvider()),
        ChangeNotifierProvider(create: (_) => HeroSearchProvider()),
      ],
      child: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          return MaterialApp(
            title: 'Hero Battle',
            debugShowCheckedModeBanner: false,
            theme: player.isDarkTheme
                ? AppTheme.darkTheme()
                : AppTheme.lightTheme(),
            initialRoute: RouteNames.splash,
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }
}

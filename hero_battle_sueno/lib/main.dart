import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/deck_provider.dart';
import 'providers/player_manager_provider.dart';
import 'providers/battle_provider.dart';
import 'providers/enemy_provider.dart';
import 'providers/enemy_deck_provider.dart';

import 'providers/hero_search_provider.dart';
import 'providers/theme_provider.dart';
import 'router/app_router.dart';

import 'providers/player_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final playerProvider = PlayerProvider();
  await playerProvider.loadPlayers();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => playerProvider),
        ChangeNotifierProvider(create: (_) => PlayerManagerProvider()),
        ChangeNotifierProvider(create: (_) => DeckProvider()),
        ChangeNotifierProvider(create: (_) => BattleProvider()),
        ChangeNotifierProvider(create: (_) => EnemyProvider()),
        ChangeNotifierProvider(create: (_) => EnemyDeckProvider()),
        ChangeNotifierProvider(create: (_) => HeroSearchProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const HeroBattleApp(),
    ),
  );
}

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: ThemeData.light(),
          darkTheme: ThemeData.dark(),
          themeMode: themeProvider.isDark ? ThemeMode.dark : ThemeMode.light,
          initialRoute: RouteNames.splash,
          onGenerateRoute: AppRouter.onGenerateRoute,
        );
      },
    );
  }
}

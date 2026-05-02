import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/deck_provider.dart';
import 'providers/battle_provider.dart';
import 'providers/player_provider.dart';
import 'providers/hero_search_provider.dart';
import 'router/app_router.dart';

void main() => runApp(const HeroBattleApp());

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
            theme: player.isDarkTheme ? _darkTheme() : _lightTheme(),
            initialRoute: RouteNames.splash,
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }

  ThemeData _darkTheme() => ThemeData(
    colorSchemeSeed: const Color(0xFF7B2FBE),
    brightness: Brightness.dark,
    useMaterial3: true,
    scaffoldBackgroundColor: const Color(0xFF0D0D1A),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF0D0D1A),
      foregroundColor: Color(0xFFE2D9F3),
      elevation: 0,
      centerTitle: true,
    ),
  );

  ThemeData _lightTheme() => ThemeData(
    colorSchemeSeed: const Color(0xFF7B2FBE),
    brightness: Brightness.light,
    useMaterial3: true,
    scaffoldBackgroundColor: const Color(0xFFF5F0FF),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFFF5F0FF),
      foregroundColor: Color(0xFF1A0A2E),
      elevation: 0,
      centerTitle: true,
    ),
  );
}
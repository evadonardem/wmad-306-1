import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/battle_provider.dart';
import 'providers/deck_provider.dart';
import 'providers/hero_search_provider.dart';
import 'router/app_router.dart';
import 'providers/player_provider.dart';

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
      child: Selector<PlayerProvider, bool>(
        selector: (_, player) => player.isDarkTheme,
        builder: (context, isDarkTheme, _) {
          return MaterialApp(
            title: 'Hero Battle',
            debugShowCheckedModeBanner: false,
            theme: isDarkTheme ? _darkTheme() : _lightTheme(),
            initialRoute: RouteNames.splash,
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }

  ThemeData _darkTheme() => ThemeData(
    colorSchemeSeed: const Color(0xFF2A7F62),
    brightness: Brightness.dark,
    useMaterial3: true,
  );

  ThemeData _lightTheme() => ThemeData(
    colorSchemeSeed: const Color(0xFF2A7F62),
    brightness: Brightness.light,
    useMaterial3: true,
  );
}

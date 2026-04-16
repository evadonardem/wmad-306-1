import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'services/superhero_api_service.dart';
import 'router/app_router.dart';
import 'providers/deck_provider.dart';
import 'providers/battle_provider.dart';
import 'providers/hero_search_provider.dart';
import 'providers/player_provider.dart';

void main() => runApp(const HeroBattleApp());

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => SuperheroApiService()),
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(
          create: (context) =>
              HeroSearchProvider(api: context.read<SuperheroApiService>()),
        ),
        ChangeNotifierProvider(create: (_) => DeckProvider()),
        ChangeNotifierProvider(create: (_) => BattleProvider()),
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
        colorSchemeSeed: const Color(0xFF0EA5E9),
        scaffoldBackgroundColor: const Color(0xFF0B1120),
        brightness: Brightness.dark,
        useMaterial3: true,
        textTheme: GoogleFonts.orbitronTextTheme(ThemeData.dark().textTheme),
      );

  ThemeData _lightTheme() => ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B5CF6),
          brightness: Brightness.light,
          surface: const Color(0xFFFFFCF8),
        ).copyWith(
          primary: const Color(0xFF5B4FEF),
          secondary: const Color(0xFFF59E0B),
          tertiary: const Color(0xFF0F766E),
          surface: const Color(0xFFFFFCF8),
          surfaceContainerHighest: const Color(0xFFF1E8DA),
          surfaceContainerHigh: const Color(0xFFF8F2E8),
          onSurface: const Color(0xFF1F2937),
          onSurfaceVariant: const Color(0xFF556075),
          outline: const Color(0xFFCDC2B1),
        ),
        scaffoldBackgroundColor: const Color(0xFFF4EEE4),
        brightness: Brightness.light,
        useMaterial3: true,
        cardTheme: CardThemeData(
          color: const Color(0xFFFFFDF9),
          elevation: 0,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          foregroundColor: Color(0xFF111827),
          elevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFFFFBF5),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFFDDD4C6)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFFDDD4C6)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF5B4FEF), width: 1.4),
          ),
        ),
        textTheme: GoogleFonts.spaceGroteskTextTheme(ThemeData.light().textTheme),
      );
}

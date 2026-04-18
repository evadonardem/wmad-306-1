import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/battle_provider.dart';
import 'providers/deck_provider.dart';
import 'providers/hero_search_provider.dart';
import 'router/app_router.dart';
import 'providers/player_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: '.env');
  } catch (_) {
    // Allow running with --dart-define if .env is not present.
  }

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
            theme: player.isDarkTheme ? _darkTheme() : _lightTheme(),
            initialRoute: RouteNames.splash,
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }

  ThemeData _darkTheme() =>
      ThemeData(
        colorSchemeSeed: const Color(0xFF24D8FF),
        brightness: Brightness.dark,
        useMaterial3: true,
      ).copyWith(
        textTheme: _roboticTextTheme(
          GoogleFonts.orbitronTextTheme(),
          isDark: true,
        ),
        appBarTheme: AppBarTheme(
          elevation: 0,
          backgroundColor: const Color(0xAA0A1328),
          surfaceTintColor: Colors.transparent,
          titleTextStyle: GoogleFonts.orbitron(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.25,
            color: const Color(0xFFEAF4FF),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            textStyle: GoogleFonts.orbitron(
              fontWeight: FontWeight.w700,
              letterSpacing: 1.0,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF0E1A2D).withValues(alpha: 0.88),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(
              color: const Color(0xFF24D8FF).withValues(alpha: 0.5),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFF24D8FF), width: 1.5),
          ),
        ),
      );

  ThemeData _lightTheme() =>
      ThemeData(
        colorSchemeSeed: const Color(0xFF24D8FF),
        brightness: Brightness.light,
        useMaterial3: true,
      ).copyWith(
        textTheme: _roboticTextTheme(
          GoogleFonts.orbitronTextTheme(),
          isDark: false,
        ),
        appBarTheme: AppBarTheme(
          elevation: 0,
          backgroundColor: const Color(0xBDF5FAFF),
          surfaceTintColor: Colors.transparent,
          titleTextStyle: GoogleFonts.orbitron(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.25,
            color: const Color(0xFF0B2340),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            textStyle: GoogleFonts.orbitron(
              fontWeight: FontWeight.w700,
              letterSpacing: 1.0,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFE9F5FF).withValues(alpha: 0.95),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(
              color: const Color(0xFF1498B8).withValues(alpha: 0.42),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFF1498B8), width: 1.5),
          ),
        ),
      );

  TextTheme _roboticTextTheme(TextTheme base, {required bool isDark}) {
    TextStyle widen(TextStyle? style, FontWeight weight, double spacing) {
      final resolved = style ?? const TextStyle();
      return resolved.copyWith(
        fontWeight: weight,
        letterSpacing: spacing,
        color: isDark ? const Color(0xFFEAF4FF) : const Color(0xFF0A2747),
      );
    }

    return base.copyWith(
      displayLarge: widen(base.displayLarge, FontWeight.w800, 1.45),
      displayMedium: widen(base.displayMedium, FontWeight.w800, 1.35),
      displaySmall: widen(base.displaySmall, FontWeight.w700, 1.25),
      headlineLarge: widen(base.headlineLarge, FontWeight.w800, 1.3),
      headlineMedium: widen(base.headlineMedium, FontWeight.w800, 1.2),
      headlineSmall: widen(base.headlineSmall, FontWeight.w700, 1.15),
      titleLarge: widen(base.titleLarge, FontWeight.w800, 1.1),
      titleMedium: widen(base.titleMedium, FontWeight.w700, 1.0),
      titleSmall: widen(base.titleSmall, FontWeight.w700, 0.95),
      bodyLarge: widen(base.bodyLarge, FontWeight.w600, 0.9),
      bodyMedium: widen(base.bodyMedium, FontWeight.w600, 0.85),
      bodySmall: widen(base.bodySmall, FontWeight.w600, 0.75),
      labelLarge: widen(base.labelLarge, FontWeight.w700, 0.95),
      labelMedium: widen(base.labelMedium, FontWeight.w700, 0.9),
      labelSmall: widen(base.labelSmall, FontWeight.w700, 0.85),
    );
  }
}

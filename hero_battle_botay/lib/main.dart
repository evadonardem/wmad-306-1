import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'providers/hero_search_provider.dart';
import 'providers/player_provider.dart';
import 'router/app_router.dart';

void main() => runApp(const HeroBattleApp());

class HeroBattleApp extends StatelessWidget {
  const HeroBattleApp({super.key

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(create: (_) => HeroSearchProvider()),
      ],
      child: Consumer<PlayerProvider>(
        builder: (context, player, _) {
          return MaterialApp(
            title: 'Hero Battle',
            debugShowCheckedModeBanner: false,
            theme: _darkNeonTheme(),
            darkTheme: _darkNeonTheme(),
            themeMode: ThemeMode.dark,
            initialRoute: RouteNames.splash,
            onGenerateRoute: AppRouter.onGenerateRoute,
          );
        },
      ),
    );
  }

  ThemeData _darkNeonTheme() {
    const neonBlue = Color(0xFF00E5FF);
    const neonMagenta = Color(0xFFFF2BD6);
    const neonViolet = Color(0xFF6F62FF);
    const surface = Color(0xFF0B0D1A);
    const surfaceAlt = Color(0xFF111529);
    const edge = Color(0xFF25315C);

    final scheme = const ColorScheme.dark().copyWith(
      primary: neonBlue,
      onPrimary: const Color(0xFF001317),
      primaryContainer: const Color(0xFF003542),
      onPrimaryContainer: const Color(0xFFA8F4FF),
      secondary: neonMagenta,
      onSecondary: const Color(0xFF300026),
      secondaryContainer: const Color(0xFF5C1A53),
      onSecondaryContainer: const Color(0xFFFFD7F7),
      tertiary: neonViolet,
      onTertiary: const Color(0xFF130047),
      tertiaryContainer: const Color(0xFF2A1E77),
      onTertiaryContainer: const Color(0xFFE5DEFF),
      surface: surface,
      onSurface: const Color(0xFFEAF3FF),
      surfaceContainerHighest: surfaceAlt,
      onSurfaceVariant: const Color(0xFFB9C4EB),
      outline: edge,
      outlineVariant: const Color(0xFF1A2450),
      error: const Color(0xFFFF5D7D),
      onError: const Color(0xFF2A0010),
      errorContainer: const Color(0xFF5A1026),
      onErrorContainer: const Color(0xFFFFD9E0),
    );

    final baseText = GoogleFonts.orbitronTextTheme(
      ThemeData(brightness: Brightness.dark).textTheme,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: const Color(0xFF060915),
      textTheme: baseText.apply(
        bodyColor: scheme.onSurface,
        displayColor: scheme.onSurface,
      ),
      cardTheme: CardThemeData(
        color: surfaceAlt.withValues(alpha: 0.92),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: BorderSide(color: edge.withValues(alpha: 0.75), width: 1.0),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: scheme.onSurface,
        elevation: 0,
        centerTitle: false,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF0E1326),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: edge.withValues(alpha: 0.75)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: edge.withValues(alpha: 0.75)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: neonBlue, width: 1.6),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: neonBlue,
          foregroundColor: const Color(0xFF001319),
          textStyle: GoogleFonts.orbitron(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: scheme.onSurface,
          side: BorderSide(color: neonMagenta.withValues(alpha: 0.75)),
          textStyle: GoogleFonts.orbitron(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFF161D38),
        labelStyle: GoogleFonts.spaceGrotesk(
          color: scheme.onSurface,
          fontWeight: FontWeight.w600,
        ),
        side: BorderSide(color: edge.withValues(alpha: 0.8)),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: neonBlue,
        linearTrackColor: Color(0xFF1A2244),
      ),
    );
  }
}

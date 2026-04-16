import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'router/app_router.dart';
import 'providers/player_provider.dart';
import 'providers/deck_provider.dart';
import 'theme/cyber_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialise FFI-based SQLite for desktop platforms
  if (!kIsWeb && (Platform.isWindows || Platform.isLinux)) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
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

  TextTheme _cyberTextTheme(TextTheme base) {
    return GoogleFonts.rajdhaniTextTheme(base);
  }

  ThemeData _darkTheme() {
    const bg = CyberColors.background;
    const surface = CyberColors.surface;
    const card = CyberColors.card;
    const primary = CyberColors.cyan;
    const secondary = CyberColors.magenta;
    const onSurface = CyberColors.textPrimary;

    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
    );

    return base.copyWith(
      textTheme: _cyberTextTheme(base.textTheme),
      colorScheme: const ColorScheme.dark(
        primary: primary,
        onPrimary: Color(0xFF001A20),
        secondary: secondary,
        onSecondary: Colors.white,
        surface: surface,
        onSurface: onSurface,
        surfaceContainerHighest: card,
        primaryContainer: CyberColors.cyanMuted,
        onPrimaryContainer: primary,
        secondaryContainer: Color(0xFF3D0028),
        onSecondaryContainer: secondary,
        error: CyberColors.error,
        tertiary: CyberColors.neonGreen,
      ),
      scaffoldBackgroundColor: bg,
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: CyberColors.cardBorder.withValues(alpha: 0.6)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.rajdhani(
          fontWeight: FontWeight.w700,
          fontSize: 20,
          color: onSurface,
          letterSpacing: 1.5,
        ),
        iconTheme: const IconThemeData(color: primary),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: card,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primary.withValues(alpha: 0.3)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: CyberColors.cardBorder.withValues(alpha: 0.8)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: TextStyle(color: CyberColors.textMuted),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: const Color(0xFF001A20),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: GoogleFonts.rajdhani(fontWeight: FontWeight.w700, fontSize: 16, letterSpacing: 1),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: card,
        contentTextStyle: const TextStyle(color: onSurface),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        behavior: SnackBarBehavior.floating,
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: primary.withValues(alpha: 0.2)),
        ),
      ),
      drawerTheme: const DrawerThemeData(backgroundColor: CyberColors.surface),
      dividerTheme: DividerThemeData(color: CyberColors.cardBorder.withValues(alpha: 0.5)),
      tabBarTheme: TabBarThemeData(
        labelColor: primary,
        unselectedLabelColor: CyberColors.textSecondary,
        indicatorColor: primary,
        dividerHeight: 0,
        labelStyle: GoogleFonts.rajdhani(fontWeight: FontWeight.w700, fontSize: 14, letterSpacing: 1),
        unselectedLabelStyle: GoogleFonts.rajdhani(fontWeight: FontWeight.w500, fontSize: 14),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) =>
            states.contains(WidgetState.selected) ? primary : CyberColors.textMuted),
        trackColor: WidgetStateProperty.resolveWith((states) =>
            states.contains(WidgetState.selected)
                ? primary.withValues(alpha: 0.3)
                : CyberColors.textMuted.withValues(alpha: 0.15)),
      ),
    );
  }

  ThemeData _lightTheme() {
    const surface = Color(0xFFF0F4FF);
    const card = Colors.white;
    const primary = Color(0xFF0088AA);
    const onSurface = Color(0xFF0A1628);

    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
    );

    return base.copyWith(
      textTheme: _cyberTextTheme(base.textTheme),
      colorScheme: ColorScheme.light(
        primary: primary,
        onPrimary: Colors.white,
        secondary: const Color(0xFFCC0066),
        surface: surface,
        onSurface: onSurface,
        surfaceContainerHighest: const Color(0xFFE8EDF8),
        primaryContainer: const Color(0xFFD0F0FF),
        onPrimaryContainer: primary,
        error: CyberColors.error,
        tertiary: const Color(0xFF00AA66),
      ),
      scaffoldBackgroundColor: surface,
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: primary.withValues(alpha: 0.12)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.rajdhani(
          fontWeight: FontWeight.w700,
          fontSize: 20,
          color: onSurface,
          letterSpacing: 1.5,
        ),
        iconTheme: IconThemeData(color: primary),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: card,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primary.withValues(alpha: 0.2)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primary.withValues(alpha: 0.2)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: GoogleFonts.rajdhani(fontWeight: FontWeight.w700, fontSize: 16, letterSpacing: 1),
        ),
      ),
      dialogTheme: DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      dividerTheme: DividerThemeData(color: primary.withValues(alpha: 0.1)),
      tabBarTheme: TabBarThemeData(
        labelColor: primary,
        unselectedLabelColor: onSurface.withValues(alpha: 0.5),
        indicatorColor: primary,
        dividerHeight: 0,
      ),
    );
  }
}

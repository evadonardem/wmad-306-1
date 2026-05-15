import 'package:adopt_a_dog/design/design_system.dart';
import 'package:adopt_a_dog/screens/breed_list_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const AdoptADogApp());
}

class AdoptADogApp extends StatelessWidget {
  const AdoptADogApp({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme =
        ColorScheme.fromSeed(
          seedColor: DesignSystem.primaryBrown,
          brightness: Brightness.light,
        ).copyWith(
          secondary: DesignSystem.accentOrange,
          surface: DesignSystem.surfaceTint,
          onSurface: DesignSystem.textPrimary,
          primary: DesignSystem.primaryBrown,
          onPrimary: Colors.white,
        );

    final baseTextTheme = ThemeData(brightness: Brightness.light).textTheme;
    final appTextTheme = GoogleFonts.manropeTextTheme(baseTextTheme).copyWith(
      displayLarge: GoogleFonts.sora(
        fontSize: 38,
        fontWeight: FontWeight.w700,
        color: DesignSystem.textPrimary,
      ),
      headlineLarge: GoogleFonts.sora(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: DesignSystem.textPrimary,
      ),
      titleLarge: GoogleFonts.sora(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: DesignSystem.textPrimary,
      ),
      bodyLarge: GoogleFonts.manrope(
        fontSize: 15,
        fontWeight: FontWeight.w500,
        height: 1.35,
        color: DesignSystem.textPrimary,
      ),
      bodyMedium: GoogleFonts.manrope(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.3,
        color: DesignSystem.textSecondary,
      ),
      labelMedium: GoogleFonts.manrope(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.4,
        color: DesignSystem.textMuted,
      ),
    );

    return MaterialApp(
      title: 'Dog Archive',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colorScheme,
        textTheme: appTextTheme,
        scaffoldBackgroundColor: DesignSystem.bgCream,
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.transparent,
          foregroundColor: DesignSystem.darkBrown,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          centerTitle: false,
          titleTextStyle: GoogleFonts.sora(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: DesignSystem.textPrimary,
          ),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          color: DesignSystem.cardBg,
          shape: RoundedRectangleBorder(
            borderRadius: DesignSystem.borderMedium,
            side: BorderSide(
              color: DesignSystem.surfaceBorder.withAlpha(235),
              width: 1,
            ),
          ),
          margin: EdgeInsets.zero,
        ),
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: DesignSystem.accentOrange,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: DesignSystem.surfaceTint,
          hintStyle: TextStyle(color: DesignSystem.textMuted, fontSize: 15),
          contentPadding: EdgeInsets.symmetric(
            vertical: DesignSystem.space12,
            horizontal: DesignSystem.space14,
          ),
          border: OutlineInputBorder(
            borderRadius: DesignSystem.borderMedium,
            borderSide: BorderSide(color: DesignSystem.surfaceBorder, width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: DesignSystem.borderMedium,
            borderSide: BorderSide(color: DesignSystem.surfaceBorder, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: DesignSystem.borderMedium,
            borderSide: BorderSide(
              color: DesignSystem.accentOrange,
              width: 1.6,
            ),
          ),
        ),
        chipTheme: ChipThemeData(
          showCheckmark: false,
          backgroundColor: DesignSystem.cardBg,
          selectedColor: DesignSystem.accentOrange.withAlpha(24),
          side: BorderSide(color: DesignSystem.surfaceBorder),
          shape: RoundedRectangleBorder(
            borderRadius: DesignSystem.borderMedium,
          ),
          labelStyle: const TextStyle(
            color: DesignSystem.textPrimary,
            fontWeight: FontWeight.w600,
          ),
          secondaryLabelStyle: const TextStyle(
            color: DesignSystem.darkBrown,
            fontWeight: FontWeight.w600,
          ),
        ),
        dividerTheme: const DividerThemeData(color: DesignSystem.surfaceBorder),
        filledButtonTheme: FilledButtonThemeData(
          style: DesignSystem.filledButtonStyle,
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: DesignSystem.outlinedButtonStyle,
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          elevation: 0,
          backgroundColor: DesignSystem.accentOrange,
          foregroundColor: Colors.white,
        ),
      ),
      home: const BreedListScreen(),
    );
  }
}

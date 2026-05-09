import 'package:flutter/material.dart';

/// Material Design 3 color tokens for PawMatch app.
class AppColors {
  // Primary palette - Forest Green (M3 tonal)
  static const primaryGreen = Color(0xFF2E4F3C);
  static const onPrimaryGreen = Color(0xFFFFFFFF);
  static const primaryContainerGreen = Color(0xFFB0EDD3);
  static const onPrimaryContainerGreen = Color(0xFF00210F);

  // Secondary palette - Teracotta (M3 tonal)
  static const secondaryTerracotta = Color(0xFFE07A5F);
  static const onSecondaryTerracotta = Color(0xFFFFFFFF);
  static const secondaryContainerTerracotta = Color(0xFFFDBD96);
  static const onSecondaryContainerTerracotta = Color(0xFF3E2817);

  // Tertiary palette - Warm Gold (accent)
  static const tertiaryGold = Color(0xFFC08000);
  static const onTertiaryGold = Color(0xFFFFFFFF);

  // Neutral palette
  static const background = Color(0xFFFBF8F2); // M3 background
  static const surface = Color(0xFFFBF8F2);
  static const surfaceVariant = Color(0xFFEFE7DE); // M3 surfaceVariant
  static const outline = Color(0xFF8B7B75);
  static const outlineVariant = Color(0xFFD7CECC);

  // Semantic colors
  static const ink = Color(0xFF1F2A24);
  static const inkSoft = Color(0xFF6B7670);
  static const cardOutline = Color(0xFFE7DFD2);

  // Convenience aliases matching usage across the app
  static const forest = primaryGreen;
  static const terracotta = secondaryTerracotta;
  static const forestSoft = Color(0xFF4A6F54);
  static const terracottaSoft = Color(0xFFE8967A);
}

class AppTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.light(
      primary: AppColors.primaryGreen,
      onPrimary: AppColors.onPrimaryGreen,
      primaryContainer: AppColors.primaryContainerGreen,
      onPrimaryContainer: AppColors.onPrimaryContainerGreen,
      secondary: AppColors.secondaryTerracotta,
      onSecondary: AppColors.onSecondaryTerracotta,
      secondaryContainer: AppColors.secondaryContainerTerracotta,
      onSecondaryContainer: AppColors.onSecondaryContainerTerracotta,
      tertiary: AppColors.tertiaryGold,
      onTertiary: AppColors.onTertiaryGold,
      background: AppColors.background,
      surface: AppColors.surface,
      surfaceVariant: AppColors.surfaceVariant,
      outline: AppColors.outline,
      outlineVariant: AppColors.outlineVariant,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      
      // M3 Typography - using Roboto (system default)
      textTheme: TextTheme(
        displayLarge: const TextStyle(
          fontSize: 57,
          fontWeight: FontWeight.w400,
          letterSpacing: -0.25,
        ),
        displayMedium: const TextStyle(
          fontSize: 45,
          fontWeight: FontWeight.w400,
          letterSpacing: 0,
        ),
        displaySmall: const TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.w400,
          letterSpacing: 0,
        ),
        headlineLarge: const TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.w400,
          letterSpacing: 0,
        ),
        headlineMedium: const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w500,
          letterSpacing: 0,
        ),
        headlineSmall: const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w500,
          letterSpacing: 0,
        ),
        titleLarge: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.1,
        ),
        titleMedium: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.15,
        ),
        titleSmall: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.1,
        ),
        bodyLarge: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.5,
        ),
        bodyMedium: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.25,
        ),
        bodySmall: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.4,
        ),
        labelLarge: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.1,
        ),
        labelMedium: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
        ),
        labelSmall: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
        ),
      ).apply(
        bodyColor: AppColors.ink,
        displayColor: AppColors.ink,
      ),

      // AppBar theme
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: AppColors.ink,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w500,
          color: AppColors.ink,
        ),
      ),

      // Card theme with M3 styling
      cardTheme: CardThemeData(
        color: colorScheme.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(28),
          side: BorderSide(
            color: colorScheme.outlineVariant,
            width: 1,
          ),
        ),
      ),

      // Navigation bar theme (M3)
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        indicatorColor: AppColors.primaryContainerGreen,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: states.contains(WidgetState.selected)
                ? AppColors.primaryGreen
                : AppColors.inkSoft,
          ),
        ),
      ),

      // Icon theme
      iconTheme: IconThemeData(color: AppColors.ink, size: 24),

      // Input decoration theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colorScheme.primary, width: 2),
        ),
        hintStyle: TextStyle(color: AppColors.inkSoft),
      ),

      // FilledButton theme (primary)
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.1,
          ),
        ),
      ),

      // OutlinedButton theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colorScheme.primary,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: colorScheme.outline, width: 1),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.1,
          ),
        ),
      ),

      // Floating Action Button theme
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: colorScheme.secondary,
        foregroundColor: colorScheme.onSecondary,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // Chip theme (for badges)
      chipTheme: ChipThemeData(
        backgroundColor: colorScheme.surfaceContainerHighest,
        disabledColor: colorScheme.surfaceContainerHighest,
        selectedColor: colorScheme.primaryContainer,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        labelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppColors.ink,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide.none,
        ),
      ),
    );
  }
}

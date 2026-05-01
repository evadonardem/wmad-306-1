import 'package:flutter/material.dart';

/// Centralized design system for the app
/// Ensures consistency across spacing, typography, colors, shadows, and interactions
class DesignSystem {
  // ============================================================================
  // COLORS
  // ============================================================================

  static const Color primaryBrown = Color(0xFF8D5C2B);
  static const Color darkBrown = Color(0xFF2E1406);
  static const Color accentOrange = Color(0xFFFFA33F);

  static const Color bgCream = Color(0xFFFFF8EE);
  static const Color bgBeige = Color(0xFFF6E8D5);
  static const Color cardBg = Colors.white;

  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF666666);
  static const Color textMuted = Color(0xFF997755);

  static const Color pawBrown = Color(0xFF8D5C2B);
  static const Color pawBrownFaint = Color(0xFF97785D);

  // ============================================================================
  // SPACING (8px base unit)
  // ============================================================================

  static const double space4 = 4;
  static const double space6 = 6;
  static const double space8 = 8;
  static const double space12 = 12;
  static const double space14 = 14;
  static const double space16 = 16;
  static const double space20 = 20;
  static const double space24 = 24;
  static const double space32 = 32;
  static const double space40 = 40;
  static const double space48 = 48;

  // ============================================================================
  // BORDER RADIUS
  // ============================================================================

  static const double radiusSmall = 8;
  static const double radiusMedium = 12;
  static const double radiusLarge = 16;
  static const double radiusXL = 24;

  static const BorderRadius borderSmall = BorderRadius.all(Radius.circular(radiusSmall));
  static const BorderRadius borderMedium = BorderRadius.all(Radius.circular(radiusMedium));
  static const BorderRadius borderLarge = BorderRadius.all(Radius.circular(radiusLarge));
  static const BorderRadius borderXL = BorderRadius.all(Radius.circular(radiusXL));

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================

  // Display/Hero (36-40px) - for Dog of the Day breed name
  static const TextStyle displayLarge = TextStyle(
    fontSize: 40,
    fontWeight: FontWeight.w900,
    color: Colors.white,
    height: 1,
    letterSpacing: -1,
  );

  // Title Extra Large (32px) - main screen titles
  static const TextStyle titleXL = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w800,
    color: textPrimary,
    letterSpacing: -0.5,
  );

  // Title Large (28px) - breed detail title
  static const TextStyle titleLg = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.w800,
    color: textPrimary,
    letterSpacing: -0.3,
  );

  // Title Medium (20px) - section headers
  static const TextStyle titleMd = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.2,
  );

  // Title Small (18px) - card titles
  static const TextStyle titleSm = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: textPrimary,
  );

  // Label (12px) - sub-text, labels
  static const TextStyle labelLg = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: textMuted,
    letterSpacing: 0.5,
  );

  // Body Text (16px)
  static const TextStyle bodyLg = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: textPrimary,
    height: 1.5,
  );

  // Body Text (14px)
  static const TextStyle bodyMd = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: textSecondary,
    height: 1.5,
  );

  // ============================================================================
  // SHADOWS (Material Design 3 inspired)
  // ============================================================================

  static const List<BoxShadow> shadowNone = [];

  static const List<BoxShadow> shadowSmall = [
    BoxShadow(color: Color(0x1A000000), blurRadius: 4, offset: Offset(0, 2)),
  ];

  static const List<BoxShadow> shadowMedium = [
    BoxShadow(color: Color(0x24000000), blurRadius: 8, offset: Offset(0, 4)),
  ];

  static const List<BoxShadow> shadowLarge = [
    BoxShadow(color: Color(0x33000000), blurRadius: 16, offset: Offset(0, 8)),
  ];

  static const List<BoxShadow> shadowXL = [
    BoxShadow(color: Color(0x40000000), blurRadius: 24, offset: Offset(0, 12)),
  ];

  // ============================================================================
  // GRADIENTS
  // ============================================================================

  static const LinearGradient bgGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [bgCream, bgBeige],
  );

  static const LinearGradient heroOverlay = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0x0F000000), Color(0x82000000)],
  );

  // ============================================================================
  // ANIMATION CURVES & DURATIONS
  // ============================================================================

  static const Duration durationQuick = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 300);
  static const Duration durationSlow = Duration(milliseconds: 500);

  static const Curve curveEaseOut = Curves.easeOutCubic;
  static const Curve curveEaseIn = Curves.easeInCubic;
  static const Curve curveSmooth = Curves.easeInOutCubic;

  // ============================================================================
  // CARD DECORATION (for reuse)
  // ============================================================================

  static BoxDecoration get cardDecoration =>
      BoxDecoration(color: cardBg, borderRadius: borderMedium, boxShadow: shadowSmall);

  static BoxDecoration get cardDecorationElevated =>
      BoxDecoration(color: cardBg, borderRadius: borderMedium, boxShadow: shadowMedium);

  // ============================================================================
  // BUTTON STYLES
  // ============================================================================

  static ButtonStyle get filledButtonStyle => FilledButton.styleFrom(
    backgroundColor: primaryBrown,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: space24, vertical: space12),
    shape: RoundedRectangleBorder(borderRadius: borderMedium),
  );

  static ButtonStyle get outlinedButtonStyle => OutlinedButton.styleFrom(
    foregroundColor: primaryBrown,
    side: const BorderSide(color: primaryBrown),
    padding: const EdgeInsets.symmetric(horizontal: space24, vertical: space12),
    shape: RoundedRectangleBorder(borderRadius: borderMedium),
  );

  // ============================================================================
  // RESPONSIVE BREAKPOINTS
  // ============================================================================

  // Screen size breakpoints for responsive design
  static const double phoneBreakpoint = 600; // < 600dp = phone
  static const double tabletBreakpoint = 1200; // 600-1200dp = tablet
  // > 1200dp = desktop/laptop

  /// Get responsive padding based on screen width
  static EdgeInsets getResponsivePadding(double screenWidth) {
    if (screenWidth < phoneBreakpoint) {
      // Phone: 16px
      return const EdgeInsets.symmetric(horizontal: space16);
    } else if (screenWidth < tabletBreakpoint) {
      // Tablet: 24px
      return const EdgeInsets.symmetric(horizontal: space24);
    } else {
      // Desktop/Laptop: constrained central column
      return EdgeInsets.symmetric(horizontal: (screenWidth - 900) / 2);
    }
  }

  /// Get responsive gallery item width (for wrap/grid)
  static double getResponsiveGalleryWidth(double screenWidth) {
    if (screenWidth < phoneBreakpoint) {
      return (screenWidth - 56) / 2; // 2 columns on phone
    } else if (screenWidth < tabletBreakpoint) {
      return (screenWidth - 80) / 3; // 3 columns on tablet
    } else {
      return (screenWidth - 120) / 4; // 4 columns on desktop
    }
  }

  /// Get responsive image height
  static double getResponsiveImageHeight(double screenWidth) {
    if (screenWidth < phoneBreakpoint) {
      return 200; // Phone
    } else if (screenWidth < tabletBreakpoint) {
      return 280; // Tablet
    } else {
      return 350; // Desktop
    }
  }

  /// Get responsive main image height on detail screen
  static double getMainImageHeight(double screenWidth, double screenHeight) {
    // Responsive: scale between 40-50% of device height, max 400px
    if (screenWidth < phoneBreakpoint) {
      return (screenHeight * 0.40).clamp(200, 280);
    } else if (screenWidth < tabletBreakpoint) {
      return (screenHeight * 0.45).clamp(280, 350);
    } else {
      return (screenHeight * 0.50).clamp(350, 400);
    }
  }
}

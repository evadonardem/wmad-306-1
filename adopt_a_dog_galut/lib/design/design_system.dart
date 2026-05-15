import 'package:flutter/material.dart';

/// Centralized design system for the app
/// Ensures consistency across spacing, typography, colors, shadows, and interactions
class DesignSystem {
  // ============================================================================
  // COLORS
  // ============================================================================

  static const Color primaryBrown = Color(0xFF1F2937);
  static const Color darkBrown = Color(0xFF0F172A);
  static const Color accentOrange = Color(0xFF2F80ED);

  static const Color bgCream = Color(0xFFF7F9FC);
  static const Color bgBeige = Color(0xFFF0F3F8);
  static const Color bgMist = Color(0xFFE6EBF2);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color surfaceTint = Color(0xFFF8FAFC);
  static const Color surfaceBorder = Color(0xFFD9E1EC);
  static const Color surfaceStrong = Color(0xFFEFF4FA);

  static const Color textPrimary = Color(0xFF102033);
  static const Color textSecondary = Color(0xFF425466);
  static const Color textMuted = Color(0xFF6E7F93);

  static const Color pawBrown = Color(0xFF4A5D75);
  static const Color pawBrownFaint = Color(0xFF9DAAB8);
  static const Color imagePlaceholder = Color(0xFFE4EAF2);
  static const Color imageErrorIcon = Color(0xFF6B778A);
  static const Color success = Color(0xFF2E7D32);

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

  static const BorderRadius borderSmall = BorderRadius.all(
    Radius.circular(radiusSmall),
  );
  static const BorderRadius borderMedium = BorderRadius.all(
    Radius.circular(radiusMedium),
  );
  static const BorderRadius borderLarge = BorderRadius.all(
    Radius.circular(radiusLarge),
  );
  static const BorderRadius borderXL = BorderRadius.all(
    Radius.circular(radiusXL),
  );

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================

  // Display/Hero (36-40px) - for Dog of the Day breed name
  static const TextStyle displayLarge = TextStyle(
    fontSize: 38,
    fontWeight: FontWeight.w700,
    color: Colors.white,
    height: 1,
    letterSpacing: -0.2,
  );

  // Title Extra Large (32px) - main screen titles
  static const TextStyle titleXL = TextStyle(
    fontSize: 30,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.1,
  );

  // Title Large (28px) - breed detail title
  static const TextStyle titleLg = TextStyle(
    fontSize: 26,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.2,
  );

  // Title Medium (20px) - section headers
  static const TextStyle titleMd = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: textPrimary,
    letterSpacing: 0,
  );

  // Title Small (18px) - card titles
  static const TextStyle titleSm = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w600,
    color: textPrimary,
    letterSpacing: 0.1,
  );

  // Label (12px) - sub-text, labels
  static const TextStyle labelLg = TextStyle(
    fontSize: 11,
    fontWeight: FontWeight.w600,
    color: textMuted,
    letterSpacing: 0.4,
  );

  // Body Text (16px)
  static const TextStyle bodyLg = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w500,
    color: textPrimary,
    height: 1.35,
  );

  // Body Text (14px)
  static const TextStyle bodyMd = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: textSecondary,
    height: 1.3,
  );

  // ============================================================================
  // SHADOWS (Material Design 3 inspired)
  // ============================================================================

  static const List<BoxShadow> shadowNone = [];

  static const List<BoxShadow> shadowSmall = [
    BoxShadow(color: Color(0x140B1A31), blurRadius: 10, offset: Offset(0, 3)),
  ];

  static const List<BoxShadow> shadowMedium = [
    BoxShadow(color: Color(0x1A0B1A31), blurRadius: 16, offset: Offset(0, 6)),
  ];

  static const List<BoxShadow> shadowLarge = [
    BoxShadow(color: Color(0x1F0B1A31), blurRadius: 22, offset: Offset(0, 8)),
  ];

  static const List<BoxShadow> shadowXL = [
    BoxShadow(color: Color(0x240B1A31), blurRadius: 30, offset: Offset(0, 12)),
  ];

  // ============================================================================
  // GRADIENTS
  // ============================================================================

  static const LinearGradient bgGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [bgCream, bgBeige, bgMist],
    stops: [0.0, 0.65, 1.0],
  );

  static const LinearGradient navGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [Color(0xFF2C3E50), Color(0xFF1F2E40)],
  );

  static const LinearGradient heroOverlay = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0x140F172A), Color(0xB80F172A)],
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

  static BoxDecoration get cardDecoration => BoxDecoration(
    color: cardBg,
    borderRadius: borderLarge,
    boxShadow: shadowSmall,
    border: Border.all(color: surfaceBorder.withAlpha(230), width: 1),
  );

  static BoxDecoration get cardDecorationElevated => BoxDecoration(
    color: cardBg,
    borderRadius: borderLarge,
    boxShadow: shadowMedium,
    border: Border.all(color: surfaceBorder.withAlpha(230), width: 1),
  );

  // ============================================================================
  // BUTTON STYLES
  // ============================================================================

  static ButtonStyle get filledButtonStyle => FilledButton.styleFrom(
    backgroundColor: primaryBrown,
    foregroundColor: Colors.white,
    elevation: 0,
    padding: const EdgeInsets.symmetric(horizontal: space24, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: borderMedium),
    textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
  );

  static ButtonStyle get outlinedButtonStyle => OutlinedButton.styleFrom(
    foregroundColor: primaryBrown,
    side: BorderSide(color: surfaceBorder.withAlpha(255), width: 1.2),
    padding: const EdgeInsets.symmetric(horizontal: space24, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: borderMedium),
    textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
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

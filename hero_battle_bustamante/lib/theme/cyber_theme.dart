import 'package:flutter/material.dart';

/// Cyber/Neon color palette for the entire app.
class CyberColors {
  CyberColors._();

  // ── Core ──
  static const background = Color(0xFF050510);
  static const surface = Color(0xFF0A0F1E);
  static const card = Color(0xFF0D1525);
  static const cardBorder = Color(0xFF1A2540);

  // ── Primary Neon ──
  static const cyan = Color(0xFF00D4FF);
  static const cyanDark = Color(0xFF0099CC);
  static const cyanMuted = Color(0xFF0A3D5C);

  // ── Accent ──
  static const magenta = Color(0xFFFF0080);
  static const magentaDark = Color(0xFFCC0066);
  static const neonGreen = Color(0xFF00FF88);
  static const neonGreenDark = Color(0xFF00CC6A);

  // ── Text ──
  static const textPrimary = Color(0xFFE0E8FF);
  static const textSecondary = Color(0xFF7A8BA8);
  static const textMuted = Color(0xFF4A5568);

  // ── Semantic ──
  static const gold = Color(0xFFFFD700);
  static const error = Color(0xFFFF4757);
  static const success = Color(0xFF00E676);
  static const warning = Color(0xFFFFAB00);

  // ── Stat colors ──
  static const hp = Color(0xFFFF4757);
  static const attack = Color(0xFFFF9800);
  static const defense = Color(0xFF42A5F5);
  static const speed = Color(0xFF00E5FF);
  static const power = Color(0xFFE040FB);
  static const combat = Color(0xFFFF7043);
  static const intelligence = Color(0xFF448AFF);
  static const strength = Color(0xFFFF5252);
  static const durability = Color(0xFF66BB6A);
  static const special = Color(0xFFAB47BC);

  // ── Rarity tiers ──
  static const rarityCommon = Color(0xFF78909C);
  static const rarityRare = Color(0xFF00D4FF);
  static const rarityEpic = Color(0xFFAA44FF);
  static const rarityLegendary = Color(0xFFFFD700);

  // ── Alignment ──
  static const alignGood = Color(0xFF00E676);
  static const alignBad = Color(0xFFFF4757);
  static const alignNeutral = Color(0xFF78909C);
}

/// Get rarity tier data for a hero based on total power.
({String label, Color color, Color glowColor}) getRarityTier(int totalPower) {
  if (totalPower >= 500) {
    return (
      label: 'LEGENDARY',
      color: CyberColors.rarityLegendary,
      glowColor: CyberColors.rarityLegendary.withValues(alpha: 0.6),
    );
  }
  if (totalPower >= 400) {
    return (
      label: 'EPIC',
      color: CyberColors.rarityEpic,
      glowColor: CyberColors.rarityEpic.withValues(alpha: 0.5),
    );
  }
  if (totalPower >= 250) {
    return (
      label: 'RARE',
      color: CyberColors.rarityRare,
      glowColor: CyberColors.rarityRare.withValues(alpha: 0.4),
    );
  }
  return (
    label: 'COMMON',
    color: CyberColors.rarityCommon,
    glowColor: CyberColors.rarityCommon.withValues(alpha: 0.3),
  );
}

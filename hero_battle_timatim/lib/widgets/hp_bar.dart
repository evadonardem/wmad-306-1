// Animated HP bar used on the Battle screen. Drains smoothly via
// AnimatedFractionallySizedBox so HP changes are always tween-animated.
// When HP drops below 30% the bar swaps to a red gradient and pulses,
// telegraphing the danger zone.

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../theme/app_theme.dart';

class HpBar extends StatelessWidget {
  final int currentHp;
  final int maxHp;
  final String label;
  final bool flipped; // mirror gradient for the AI side

  const HpBar({
    super.key,
    required this.currentHp,
    required this.maxHp,
    required this.label,
    this.flipped = false,
  });

  @override
  Widget build(BuildContext context) {
    final pct = (maxHp == 0 ? 0.0 : currentHp / maxHp).clamp(0.0, 1.0);
    final low = pct < 0.3;
    final critical = pct < 0.15 && currentHp > 0;

    final start = low
        ? AppColors.danger
        : (flipped ? AppColors.secondary : AppColors.primary);
    final end = low
        ? const Color(0xFFFF7B3D)
        : (flipped ? AppColors.primary : AppColors.secondary);
    final glow = low ? AppColors.danger : start;

    Widget fill = AnimatedFractionallySizedBox(
      duration: const Duration(milliseconds: 450),
      curve: Curves.easeOutCubic,
      widthFactor: pct,
      heightFactor: 1,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [start, end]),
        ),
      ),
    );
    if (critical) {
      // Pulsing sheen when the hero is about to fall.
      fill = fill
          .animate(onPlay: (c) => c.repeat(reverse: true))
          .fadeIn(duration: 700.ms, begin: 0.65);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: AppColors.textHigh,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                  ),
                ),
                if (low) ...[
                  const SizedBox(width: 6),
                  Icon(
                    Icons.warning_amber_rounded,
                    color: AppColors.danger,
                    size: 14,
                  ),
                ],
              ],
            ),
            Text(
              '$currentHp / $maxHp',
              style: TextStyle(
                color: low ? AppColors.danger : AppColors.textMedium,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Container(
          height: 18,
          decoration: BoxDecoration(
            color: AppColors.surfaceSoft,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: glow.withAlpha((0.7 * 255).round())),
            boxShadow: [
              BoxShadow(color: glow.withAlpha((0.45 * 255).round()), blurRadius: 10),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Align(alignment: Alignment.centerLeft, child: fill),
          ),
        ),
      ],
    );
  }
}

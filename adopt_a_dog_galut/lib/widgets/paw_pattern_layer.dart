import 'package:adopt_a_dog/design/design_system.dart';
import 'package:flutter/material.dart';

class PawPatternLayer extends StatelessWidget {
  const PawPatternLayer({super.key});

  @override
  Widget build(BuildContext context) {
    final primary = DesignSystem.pawBrown.withAlpha(28);
    final secondary = DesignSystem.pawBrownFaint.withAlpha(24);
    final highlight = Colors.white.withAlpha(95);

    return IgnorePointer(
      child: Stack(
        children: [
          Positioned(
            top: 84,
            left: 36,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(shape: BoxShape.circle, color: primary),
            ),
          ),
          Positioned(
            top: 250,
            right: 22,
            child: Container(
              width: 130,
              height: 130,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: secondary,
              ),
            ),
          ),
          Positioned(
            bottom: 110,
            left: -24,
            child: Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: secondary,
              ),
            ),
          ),
          Positioned(
            top: 160,
            right: 66,
            child: Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: highlight,
              ),
            ),
          ),
          Positioned(
            top: 420,
            left: 110,
            child: Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: highlight,
              ),
            ),
          ),
          Positioned(
            bottom: 72,
            right: 46,
            child: Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: highlight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

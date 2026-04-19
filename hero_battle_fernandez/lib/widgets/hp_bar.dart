import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  const HpBar({
    super.key,
    required this.label,
    required this.current,
    required this.max,
  });

  final String label;
  final int current;
  final int max;

  @override
  Widget build(BuildContext context) {
    final value = max <= 0 ? 0.0 : (current / max).clamp(0.0, 1.0);
    final scheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Text('$current / $max HP'),
          ],
        ),
        const SizedBox(height: 8),
        TweenAnimationBuilder<double>(
          tween: Tween<double>(end: value),
          duration: const Duration(milliseconds: 450),
          curve: Curves.easeOutCubic,
          builder: (context, animatedValue, _) {
            return LinearProgressIndicator(
              value: animatedValue,
              minHeight: 12,
              borderRadius: BorderRadius.circular(8),
              color: animatedValue > 0.35 ? scheme.primary : scheme.error,
              backgroundColor: scheme.surfaceContainerHighest,
            );
          },
        ),
      ],
    );
  }
}

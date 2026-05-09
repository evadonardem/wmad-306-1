import 'package:flutter/material.dart';

class VitalityBar extends StatelessWidget {
  final int current;
  final int max;
  final double height;

  const VitalityBar({
    super.key,
    required this.current,
    required this.max,
    this.height = 10,
  });

  @override
  Widget build(BuildContext context) {
    final ratio = max == 0 ? 0.0 : (current / max).clamp(0.0, 1.0);
    final color = ratio > 0.5
        ? Colors.greenAccent
        : ratio > 0.25
        ? Colors.amber
        : Colors.redAccent;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'VIT',
              style: Theme.of(context).textTheme.labelSmall,
            ),
            Text(
              '$current / $max',
              style: Theme.of(context).textTheme.labelSmall,
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(height),
          child: LinearProgressIndicator(
            value: ratio,
            minHeight: height,
            backgroundColor:
                Theme.of(context).colorScheme.surfaceContainerHighest,
            valueColor: AlwaysStoppedAnimation(color),
          ),
        ),
      ],
    );
  }
}

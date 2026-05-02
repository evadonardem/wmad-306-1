import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  final int currentHp;
  final int maxHp;
  final String heroName;
  final bool isPlayer;
  final bool showName;

  const HpBar({
    super.key,
    required this.currentHp,
    required this.maxHp,
    required this.heroName,
    this.isPlayer = true,
    this.showName = true,
  });

  double get percentage => currentHp / maxHp;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final titleStyle = theme.textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.bold,
        ) ??
        const TextStyle(fontWeight: FontWeight.bold, fontSize: 16);
    final hpStyle = theme.textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.bold,
        ) ??
        const TextStyle(fontWeight: FontWeight.bold, fontSize: 14);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (showName)
              Text(
                heroName,
                style: titleStyle,
              ),
            if (!showName) const SizedBox.shrink(),
            Text(
              '$currentHp / $maxHp',
              style: hpStyle,
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: percentage,
            minHeight: 12,
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            color: isPlayer
                ? (percentage > 0.5
                    ? Colors.green
                    : percentage > 0.2
                        ? Colors.orange
                        : Colors.red)
                : (percentage > 0.5
                ? Colors.blue
                    : percentage > 0.2
                  ? Colors.lightBlue
                        : Colors.red),
          ),
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  final int currentHp;
  final int maxHp;
  final String? label;

  const HpBar({
    super.key,
    required this.currentHp,
    required this.maxHp,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final percentage = (currentHp / maxHp).clamp(0, 1);
    final color = percentage > 0.5 ? Colors.green : 
                  percentage > 0.2 ? Colors.orange : Colors.red;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null)
          Text(
            label!,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: percentage,
            minHeight: 20,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '$currentHp / $maxHp',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

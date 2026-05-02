import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  final int currentHp;
  final int maxHp;
  final String heroName;

  const HpBar({
    super.key,
    required this.currentHp,
    required this.maxHp,
    required this.heroName,
  });

  @override
  Widget build(BuildContext context) {
    double percentage = currentHp / maxHp;
    if (percentage < 0) percentage = 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$heroName (${currentHp > 0 ? currentHp : 0}/$maxHp)',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: percentage,
            minHeight: 12,
            backgroundColor: Colors.grey.shade800,
            color: percentage > 0.5 
                ? Colors.green 
                : (percentage > 0.2 ? Colors.orange : Colors.red),
          ),
        ),
      ],
    );
  }
}
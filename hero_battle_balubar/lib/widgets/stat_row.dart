import 'package:flutter/material.dart';

class StatRow extends StatelessWidget {
  final String label;
  final int value;
  final int maxValue;
  final IconData? icon;
  final Color? color;

  const StatRow({
    super.key,
    required this.label,
    required this.value,
    required this.maxValue,
    this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final percentage = (value / maxValue).clamp(0.0, 1.0);
    final displayColor = color ?? _getColorForValue(percentage);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: displayColor, size: 20),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Spacer(),
              Text(
                '$value/$maxValue',
                style: TextStyle(
                  color: displayColor,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: percentage,
              backgroundColor: Colors.grey[700],
              valueColor: AlwaysStoppedAnimation(displayColor),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Color _getColorForValue(double percentage) {
    if (percentage > 0.7) return Colors.green;
    if (percentage > 0.4) return Colors.orange;
    return Colors.red;
  }
}

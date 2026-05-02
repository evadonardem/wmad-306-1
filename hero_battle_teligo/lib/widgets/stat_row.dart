import 'package:flutter/material.dart';

class StatRow extends StatelessWidget {
  final String label;
  final int value;
  final Color color;

  const StatRow({
    super.key,
    required this.label,
    required this.value,
    this.color = const Color(0xFFA855F7),
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: Color(0xFF9370DB)),
            ),
          ),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(3),
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: value / 100),
                duration: const Duration(milliseconds: 700),
                curve: Curves.easeOut,
                builder: (_, v, __) => LinearProgressIndicator(
                  value: v,
                  backgroundColor: const Color(0xFF1A1A2E),
                  color: color,
                  minHeight: 8,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          SizedBox(
            width: 30,
            child: Text(
              '$value',
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFFE2D9F3),
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
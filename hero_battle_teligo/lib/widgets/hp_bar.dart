import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  final int current;
  final int max;
  final Color color;

  const HpBar({
    super.key,
    required this.current,
    required this.max,
    this.color = const Color(0xFFA855F7),
  });

  @override
  Widget build(BuildContext context) {
    final ratio = max == 0 ? 0.0 : (current / max).clamp(0.0, 1.0);
    final barColor = ratio > 0.5
        ? color
        : ratio > 0.25
            ? const Color(0xFFFBBF24)
            : const Color(0xFFF87171);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('HP', style: TextStyle(fontSize: 10, color: Color(0xFF888888))),
            Text(
              '$current / $max',
              style: const TextStyle(fontSize: 10, color: Color(0xFF888888)),
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 1.0, end: ratio),
            duration: const Duration(milliseconds: 400),
            builder: (_, value, __) => LinearProgressIndicator(
              value: value,
              backgroundColor: const Color(0xFF0D0D1A),
              color: barColor,
              minHeight: 8,
            ),
          ),
        ),
      ],
    );
  }
}
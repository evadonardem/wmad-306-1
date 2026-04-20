// Stat row widget
import 'package:flutter/material.dart';

class StatRow extends StatelessWidget {
  final String label;
  final int value;
  const StatRow({super.key, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [Text(label), Text(value.toString())],
    );
  }
}

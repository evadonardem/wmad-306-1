// HP bar widget
import 'package:flutter/material.dart';

class HpBar extends StatelessWidget {
  final double value;
  const HpBar({super.key, required this.value});

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      value: value,
      backgroundColor: Colors.red[100],
      valueColor: AlwaysStoppedAnimation<Color>(Colors.red),
    );
  }
}

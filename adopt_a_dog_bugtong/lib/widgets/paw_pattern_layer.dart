import 'package:flutter/material.dart';

class PawPatternLayer extends StatelessWidget {
  const PawPatternLayer({super.key});

  @override
  Widget build(BuildContext context) {
    final pawColor = const Color(0xFF8D5C2B).withAlpha(105);
    final faintPaw = const Color(0xFF8D5C2B).withAlpha(62);

    return IgnorePointer(
      child: Stack(
        children: [
          Positioned(
            top: 22,
            left: 22,
            child: Icon(Icons.pets, size: 24, color: pawColor),
          ),
          Positioned(
            top: 22,
            left: 110,
            child: Icon(Icons.pets, size: 28, color: pawColor),
          ),
          Positioned(
            top: 62,
            right: 48,
            child: Icon(Icons.pets, size: 20, color: pawColor),
          ),
          Positioned(
            top: 108,
            left: 176,
            child: Icon(Icons.pets, size: 22, color: pawColor),
          ),
          Positioned(
            top: 202,
            right: 18,
            child: Icon(Icons.pets, size: 26, color: faintPaw),
          ),
          Positioned(
            top: 292,
            left: 16,
            child: Icon(Icons.pets, size: 22, color: pawColor),
          ),
          Positioned(
            top: 354,
            right: 36,
            child: Icon(Icons.pets, size: 20, color: pawColor),
          ),
          Positioned(
            top: 388,
            right: 118,
            child: Icon(Icons.pets, size: 24, color: pawColor),
          ),
          Positioned(
            top: 434,
            left: 116,
            child: Icon(Icons.pets, size: 24, color: faintPaw),
          ),
          Positioned(
            top: 520,
            right: 96,
            child: Icon(Icons.pets, size: 20, color: faintPaw),
          ),
          Positioned(
            top: 610,
            left: 62,
            child: Icon(Icons.pets, size: 22, color: faintPaw),
          ),
          Positioned(
            bottom: 86,
            right: 26,
            child: Icon(Icons.pets, size: 18, color: faintPaw),
          ),
        ],
      ),
    );
  }
}

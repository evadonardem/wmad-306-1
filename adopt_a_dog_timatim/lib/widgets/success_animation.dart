import 'dart:math';

import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Lightweight confetti substitute — a burst of hearts that scale + fly up.
/// No Lottie asset required so the project runs out-of-the-box.
class HeartBurst extends StatefulWidget {
  const HeartBurst({super.key, this.count = 18});
  final int count;

  @override
  State<HeartBurst> createState() => _HeartBurstState();
}

class _HeartBurstState extends State<HeartBurst>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final List<_Particle> _particles;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
    final rng = Random();
    _particles = List.generate(widget.count, (_) => _Particle.random(rng));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (context, _) {
        return Stack(
          alignment: Alignment.center,
          children: [
            for (final p in _particles) _build(p),
            // Center confirming heart that scales up and softly bounces.
            Transform.scale(
              scale: _centerScale(_ctrl.value),
              child: Container(
                width: 92,
                height: 92,
                decoration: const BoxDecoration(
                  color: AppColors.terracotta,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.favorite,
                  color: Colors.white,
                  size: 48,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  double _centerScale(double t) {
    // Pop, then settle.
    if (t < 0.4) return Curves.easeOutBack.transform(t / 0.4);
    return 1 - (t - 0.4) * 0.05;
  }

  Widget _build(_Particle p) {
    final t = Curves.easeOut.transform(_ctrl.value);
    final dx = p.dx * 140 * t;
    final dy = -p.dy * 220 * t;
    final opacity = (1 - t).clamp(0.0, 1.0);
    final scale = (0.4 + t * 1.2) * p.size;
    return Transform.translate(
      offset: Offset(dx, dy),
      child: Opacity(
        opacity: opacity,
        child: Transform.rotate(
          angle: p.rotation * t,
          child: Transform.scale(
            scale: scale,
            child: Icon(Icons.favorite, color: p.color, size: 24),
          ),
        ),
      ),
    );
  }
}

class _Particle {
  _Particle({
    required this.dx,
    required this.dy,
    required this.color,
    required this.rotation,
    required this.size,
  });

  factory _Particle.random(Random rng) {
    final colors = [
      AppColors.terracotta,
      AppColors.terracottaSoft,
      AppColors.forest,
      AppColors.forestSoft,
    ];
    return _Particle(
      dx: (rng.nextDouble() - 0.5) * 2, // -1..1
      dy: 0.3 + rng.nextDouble() * 0.9, // upward bias
      color: colors[rng.nextInt(colors.length)],
      rotation: (rng.nextDouble() - 0.5) * 1.4,
      size: 0.7 + rng.nextDouble() * 0.7,
    );
  }

  final double dx;
  final double dy;
  final Color color;
  final double rotation;
  final double size;
}

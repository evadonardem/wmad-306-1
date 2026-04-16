import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/player_provider.dart';
import '../../router/app_router.dart';
import '../../theme/cyber_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _particleController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _particleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat();
    _init();
  }

  Future<void> _init() async {
    try {
      await context
          .read<PlayerProvider>()
          .loadFromPrefs()
          .timeout(const Duration(seconds: 3));
    } catch (error, stackTrace) {
      debugPrint('Splash initialization failed: $error');
      debugPrintStack(stackTrace: stackTrace);
    }
    await Future.delayed(const Duration(milliseconds: 2500));
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, RouteNames.home);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _particleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -0.2),
            radius: 1.0,
            colors: [
              Color(0xFF0A1628),
              CyberColors.background,
            ],
          ),
        ),
        child: LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth == 0 || constraints.maxHeight == 0) {
              return const SizedBox.shrink();
            }
            return Stack(
              children: [
                // Grid pattern
                Positioned.fill(
                  child: CustomPaint(
                    size: Size.infinite,
                    painter: _SplashGridPainter(),
                  ),
                ),
                // Particles
                Positioned.fill(
                  child: AnimatedBuilder(
                    animation: _particleController,
                    builder: (context, _) => CustomPaint(
                      size: Size.infinite,
                      painter: _ParticlePainter(
                        progress: _particleController.value,
                      ),
                    ),
                  ),
                ),
            // Scan line
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, _) => Positioned(
                left: 0,
                right: 0,
                top: MediaQuery.of(context).size.height *
                    _pulseController.value,
                child: Container(
                  height: 1,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        CyberColors.cyan.withValues(alpha: 0.15),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ),
            // Main content
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo slam
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: CyberColors.cyan.withValues(
                              alpha: 0.3 + _pulseController.value * 0.3,
                            ),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: CyberColors.cyan.withValues(
                                alpha: 0.1 + _pulseController.value * 0.2,
                              ),
                              blurRadius: 30 + _pulseController.value * 20,
                              spreadRadius: _pulseController.value * 8,
                            ),
                            BoxShadow(
                              color: CyberColors.magenta.withValues(
                                alpha: 0.05 + _pulseController.value * 0.1,
                              ),
                              blurRadius: 40,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: child,
                      );
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [CyberColors.cyan, Color(0xFF0066AA)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: CyberColors.cyan.withValues(alpha: 0.4),
                            blurRadius: 20,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.bolt, size: 52, color: Colors.white),
                    ),
                  )
                      .animate()
                      .scale(
                        begin: const Offset(3.0, 3.0),
                        end: const Offset(1.0, 1.0),
                        duration: 500.ms,
                        curve: Curves.easeOutBack,
                      )
                      .fadeIn(duration: 300.ms),
                  const SizedBox(height: 36),
                  Text(
                    'HERO BATTLE',
                    style: GoogleFonts.rajdhani(
                      fontSize: 38,
                      fontWeight: FontWeight.w900,
                      color: CyberColors.textPrimary,
                      letterSpacing: 8,
                      shadows: [
                        Shadow(
                          color: CyberColors.cyan.withValues(alpha: 0.8),
                          blurRadius: 20,
                        ),
                        Shadow(
                          color: CyberColors.cyan.withValues(alpha: 0.4),
                          blurRadius: 40,
                        ),
                      ],
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 400.ms, duration: 400.ms)
                      .slideY(begin: 0.3, end: 0, duration: 400.ms, curve: Curves.easeOut),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(color: CyberColors.cyan.withValues(alpha: 0.3)),
                        bottom: BorderSide(color: CyberColors.cyan.withValues(alpha: 0.3)),
                      ),
                    ),
                    child: Text(
                      'ASSEMBLE  //  FIGHT  //  CONQUER',
                      style: GoogleFonts.rajdhani(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: CyberColors.cyan.withValues(alpha: 0.7),
                        letterSpacing: 3,
                      ),
                    ),
                  ).animate().fadeIn(delay: 700.ms, duration: 400.ms),
                  const SizedBox(height: 48),
                  SizedBox(
                    width: 120,
                    child: Column(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: const SizedBox(
                            height: 3,
                            child: LinearProgressIndicator(
                              backgroundColor: Color(0xFF1A2540),
                              valueColor: AlwaysStoppedAnimation(CyberColors.cyan),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'INITIALIZING',
                          style: GoogleFonts.rajdhani(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: CyberColors.textMuted,
                            letterSpacing: 3,
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(delay: 900.ms, duration: 400.ms),
                ],
              ),
            ),
          ],
        );
          },
        ),
      ),
    );
  }
}

class _SplashGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    if (size.width == 0 || size.height == 0) return;
    final paint = Paint()
      ..color = CyberColors.cyan.withValues(alpha: 0.04)
      ..strokeWidth = 0.5;
    const gridSize = 40.0;
    for (double x = 0; x <= size.width; x += gridSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += gridSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ParticlePainter extends CustomPainter {
  final double progress;
  final _rng = Random(42);

  _ParticlePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width == 0 || size.height == 0) return;
    for (int i = 0; i < 20; i++) {
      final seed = _rng.nextDouble();
      final x = size.width * _rng.nextDouble();
      final baseY = size.height * _rng.nextDouble();
      final y = (baseY - progress * 60 * seed) % size.height;
      final alpha = (0.1 + seed * 0.3) *
          (1.0 - (progress - seed).abs().clamp(0.0, 1.0));
      final isCyan = i % 3 != 0;
      final color = isCyan
          ? CyberColors.cyan.withValues(alpha: alpha)
          : CyberColors.magenta.withValues(alpha: alpha * 0.7);
      canvas.drawCircle(Offset(x, y), 1 + seed * 1.5, Paint()..color = color);
    }
  }

  @override
  bool shouldRepaint(_ParticlePainter old) => true;
}

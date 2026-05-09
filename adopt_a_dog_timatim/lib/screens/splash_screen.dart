import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'home_shell.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;
  late final Animation<double> _wag;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..forward();

    _scale = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.4, curve: Curves.easeOutBack),
    );

    _wag = Tween<double>(begin: -0.08, end: 0.08).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: const Interval(0.4, 1.0, curve: Curves.easeInOut),
      ),
    );

    Future.delayed(const Duration(milliseconds: 1900), () {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          transitionDuration: const Duration(milliseconds: 500),
          pageBuilder: (_, _, _) => const HomeShell(),
          transitionsBuilder: (_, anim, _, child) =>
              FadeTransition(opacity: anim, child: child),
        ),
      );
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: AnimatedBuilder(
          animation: _ctrl,
          builder: (context, _) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ScaleTransition(
                  scale: _scale,
                  child: Transform.rotate(
                    angle: _wag.value,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: const BoxDecoration(
                        color: AppColors.forest,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.pets,
                        color: Colors.white,
                        size: 52,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
Opacity(
                   opacity: _scale.value,
                   child: Text(
                     'Dog adopter',
                     style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                           fontWeight: FontWeight.w700,
                           color: AppColors.forest,
                         ),
                   ),
                 ),
                const SizedBox(height: 6),
                Opacity(
                  opacity: _scale.value,
                  child: const Text(
                    'Find your furever friend',
                    style: TextStyle(color: AppColors.inkSoft),
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

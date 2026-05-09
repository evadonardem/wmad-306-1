import 'package:flutter/material.dart';

import '../../router/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _debugBypassLoading();
  }

  void _debugBypassLoading() {
    print('SplashScreen: Simulating loading...');
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        print('SplashScreen: Forcing navigation to home for debug.');
        Navigator.pushReplacementNamed(context, RouteNames.home);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}

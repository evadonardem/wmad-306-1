import 'package:flutter/material.dart';
import '../../router/app_router.dart';

class MechanicsScreen extends StatelessWidget {
  const MechanicsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Game Mechanics")),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              /// 📜 FULL MECHANICS (ONE PARAGRAPH)
              const Text(
                "Build a team of up to 5 heroes, each with unique stats and abilities. "
                "Battles are turn-based where heroes use skills to attack enemies. "
                "Damage depends on power, intelligence, and critical chance. "
                "Defeat all enemy heroes to win the battle, but if your entire team is defeated, you lose. "
                "Enemies can vary in strength, so strategy and team composition are important.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),

              const SizedBox(height: 40),

              /// 🎮 ONLY PLAY BUTTON CENTERED
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacementNamed(context, RouteNames.home);
                    },
                    child: const Text("Play Game"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/hero_model.dart';
import '../../providers/enemy_provider.dart';
import '../../services/superhero_api_service.dart';
import '../../widgets/hero_card.dart';

class EnemySelectionScreen extends StatefulWidget {
  const EnemySelectionScreen({super.key});

  @override
  State<EnemySelectionScreen> createState() => _EnemySelectionScreenState();
}

class _EnemySelectionScreenState extends State<EnemySelectionScreen> {
  final _api = SuperheroApiService();

  @override
  void initState() {
    super.initState();
    // Fire off async operation without blocking
  }

  Future<List<HeroModel>> _loadHeroes() async {
    final data = await _api.fetchAllHeroes();
    return data.take(100).toList(); // 🔥 YOUR 100 HEROES
  }

  @override
  Widget build(BuildContext context) {
    final enemyProvider = context.watch<EnemyProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text("Select Enemies")),
      body: FutureBuilder<List<HeroModel>>(
        future: _loadHeroes(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final heroes = snapshot.data!;

          return Column(
            children: [
              Text("Selected: ${enemyProvider.selectedEnemies.length}/5"),
              Expanded(
                child: GridView.builder(
                  itemCount: heroes.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                  ),
                  itemBuilder: (_, i) {
                    final hero = heroes[i];
                    final selected = enemyProvider.selectedEnemies.contains(
                      hero,
                    );

                    return GestureDetector(
                      onTap: () {
                        if (selected) {
                          enemyProvider.removeEnemy(hero);
                        } else {
                          enemyProvider.addEnemy(hero);
                        }
                      },
                      child: Stack(
                        children: [
                          HeroCard(hero: hero),
                          if (selected)
                            Positioned.fill(
                              child: Container(
                                color: Colors.black54,
                                child: const Icon(
                                  Icons.check,
                                  color: Colors.white,
                                  size: 40,
                                ),
                              ),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              ElevatedButton(
                onPressed: enemyProvider.selectedEnemies.length == 5
                    ? () {
                        Navigator.pushNamed(context, '/battle');
                      }
                    : null,
                child: const Text("Start Battle"),
              ),
            ],
          );
        },
      ),
    );
  }
}

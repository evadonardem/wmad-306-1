import 'package:flutter/material.dart';
import '../../services/database_service.dart';

import '../../models/battle_model.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  Future<List<BattleModel>> _loadHistory() async {
    return await DatabaseService().getBattles();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Battle History')),
      body: FutureBuilder<List<BattleModel>>(
        future: _loadHistory(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No battle history yet.'));
          }
          final battles = snapshot.data!;
          return ListView.builder(
            itemCount: battles.length,
            itemBuilder: (context, index) {
              final battle = battles[index];
              return ListTile(
                title: Text('Result: \\${battle.result}'),
                subtitle: Text('Date: \\${battle.date.toLocal()}'),
              );
            },
          );
        },
      ),
    );
  }
}
